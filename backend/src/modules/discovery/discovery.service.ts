import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infra/prisma/prisma.service';
import { AppLogger } from '../logging/logging.service';
import { DiscoverLeadsDto } from './dto/discover-leads.dto';
import fetch from 'node-fetch';
import * as cheerio from 'cheerio';
import { URL } from 'url';

interface RawLead {
  email: string;
  name?: string;
  company?: string;
  website?: string;
  sourceUrl: string;
}

@Injectable()
export class DiscoveryService {
  constructor(private prisma: PrismaService, private logger: AppLogger) {}

  async enqueueDiscovery(payload: DiscoverLeadsDto, ownerId: string) {
    const jobs = await Promise.all(
      payload.keywords.map((keyword) =>
        this.prisma.discoveryJob.create({
          data: {
            ownerId,
            keyword,
          },
        }),
      ),
    );

    this.logger.log(`Queued ${jobs.length} discovery jobs for ${ownerId}`, DiscoveryService.name);

    // In production, a worker would process these asynchronously.
    // For now, process synchronously with basic throttling.
    for (const job of jobs) {
      await this.processJob(job.id, payload.limit ?? 20);
    }

    return { jobs: jobs.map((j) => ({ id: j.id, keyword: j.keyword, status: j.status })) };
  }

  async processJob(jobId: string, limit: number) {
    const job = await this.prisma.discoveryJob.findUnique({ where: { id: jobId } });
    if (!job) return;

    if (job.status === 'completed') return job;
    if (job.attempts >= job.maxAttempts) return job;

    const attempts = job.attempts + 1;

    try {
      const rawLeads = await this.searchAndScrape(job.keyword, limit);
      const deduped = this.deduplicate(rawLeads);

      for (const rl of deduped) {
        const existingLead = await this.prisma.lead.findFirst({
          where: { email: rl.email, company: rl.company ?? undefined, deletedAt: null },
        });

        const lead =
          existingLead ||
          (await this.prisma.lead.create({
            data: {
              email: rl.email,
              name: rl.name || rl.email.split('@')[0],
              company: rl.company || 'Unknown',
              websiteUrl: rl.website,
              status: 'New',
              score: 50,
            },
          }));

        await this.prisma.leadDiscoverySource.create({
          data: {
            leadId: lead.id,
            source: 'web_search',
            url: rl.sourceUrl,
            metadata: {
              keyword: job.keyword,
            },
          },
        });
      }

      const updated = await this.prisma.discoveryJob.update({
        where: { id: job.id },
        data: {
          status: 'completed',
          attempts,
          lastError: null,
        },
      });

      this.logger.log(
        `Discovery job ${job.id} completed with ${deduped.length} leads`,
        DiscoveryService.name,
      );

      return updated;
    } catch (error: any) {
      const updated = await this.prisma.discoveryJob.update({
        where: { id: job.id },
        data: {
          status: attempts >= job.maxAttempts ? 'failed' : 'pending',
          attempts,
          lastError: String(error?.message || error),
        },
      });

      this.logger.error(`Discovery job ${job.id} failed`, error?.stack, DiscoveryService.name);
      return updated;
    }
  }

  private async searchAndScrape(keyword: string, limit: number): Promise<RawLead[]> {
    // NOTE: In production, plug in a compliant search API instead of scraping search engines directly.
    // This is a placeholder that expects "SEARCH_PROVIDER_URL" to be a backend you control.

    const provider = process.env.SEARCH_PROVIDER_URL;
    if (!provider) {
      this.logger.warn('SEARCH_PROVIDER_URL not configured; discovery is disabled', DiscoveryService.name);
      return [];
    }

    const url = new URL(provider);
    url.searchParams.set('q', keyword);
    url.searchParams.set('limit', String(limit));

    const res = await fetch(url.toString());
    if (!res.ok) {
      throw new Error(`Search provider error: ${res.status}`);
    }

    const results: { url: string; title: string }[] = await res.json();

    const leads: RawLead[] = [];

    for (const r of results.slice(0, limit)) {
      if (!(await this.isAllowedByRobots(r.url))) {
        this.logger.debug?.(`Skipping ${r.url} due to robots.txt`, DiscoveryService.name);
        continue;
      }

      const scraped = await this.scrapePage(r.url);
      leads.push(...scraped);
    }

    return leads;
  }

  private async isAllowedByRobots(pageUrl: string): Promise<boolean> {
    try {
      const url = new URL(pageUrl);
      const robotsUrl = `${url.protocol}//${url.host}/robots.txt`;
      const res = await fetch(robotsUrl);
      if (!res.ok) return true; // if no robots, default allow

      const text = await res.text();
      const lines = text.split(/\r?\n/);
      const disallows: string[] = [];
      let userAgentBlock = false;

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        if (trimmed.toLowerCase().startsWith('user-agent')) {
          const ua = trimmed.split(':')[1]?.trim();
          userAgentBlock = ua === '*' || ua?.toLowerCase().includes('linkly');
        }
        if (userAgentBlock && trimmed.toLowerCase().startsWith('disallow')) {
          const path = trimmed.split(':')[1]?.trim();
          if (path) disallows.push(path);
        }
      }

      const path = url.pathname;
      for (const d of disallows) {
        if (d === '/') return false;
        if (d && path.startsWith(d)) return false;
      }

      return true;
    } catch {
      return true;
    }
  }

  private async scrapePage(pageUrl: string): Promise<RawLead[]> {
    const res = await fetch(pageUrl);
    if (!res.ok) return [];

    const html = await res.text();
    const $ = cheerio.load(html);

    const emails = new Set<string>();
    const leads: RawLead[] = [];

    const text = $('body').text();
    const regex = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;
    let match: RegExpExecArray | null;
    while ((match = regex.exec(text))) {
      emails.add(match[0].toLowerCase());
    }

    const title = $('title').text().trim();

    for (const email of emails) {
      leads.push({
        email,
        name: undefined,
        company: title || undefined,
        website: pageUrl,
        sourceUrl: pageUrl,
      });
    }

    return leads;
  }

  private deduplicate(leads: RawLead[]): RawLead[] {
    const map = new Map<string, RawLead>();
    for (const l of leads) {
      const key = `${l.email}|${l.company || ''}`;
      if (!map.has(key)) map.set(key, l);
    }
    return Array.from(map.values());
  }
}
