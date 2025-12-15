import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../infra/prisma/prisma.service';
import { AppLogger } from '../logging/logging.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';

@Injectable()
export class LeadsService {
  constructor(private prisma: PrismaService, private logger: AppLogger) {}

  async list(params: { skip?: number; take?: number; campaignId?: string }) {
    const { skip = 0, take = 50, campaignId } = params;
    return this.prisma.lead.findMany({
      where: {
        deletedAt: null,
        ...(campaignId ? { campaignId } : {}),
      },
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    });
  }

  async get(id: string) {
    const lead = await this.prisma.lead.findFirst({ where: { id, deletedAt: null } });
    if (!lead) throw new NotFoundException('Lead not found');
    return lead;
  }

  async create(payload: CreateLeadDto) {
    const existing = await this.prisma.lead.findFirst({
      where: {
        email: payload.email,
        company: payload.company,
        deletedAt: null,
      },
    });

    if (existing) {
      this.logger.log(`Deduplicated lead for ${payload.email} at ${payload.company}`, LeadsService.name);
      return existing;
    }

    const score = payload.score ?? this.scoreLead(payload);

    const created = await this.prisma.lead.create({
      data: {
        email: payload.email,
        name: payload.name,
        company: payload.company,
        websiteUrl: payload.websiteUrl,
        score,
        status: 'New',
        campaignId: payload.campaignId,
      },
    });

    await this.prisma.activityLog.create({
      data: {
        action: 'lead.created',
        context: { leadId: created.id },
      },
    });

    this.logger.log(`Created lead ${created.id}`, LeadsService.name);
    return created;
  }

  async update(id: string, payload: UpdateLeadDto) {
    await this.ensureExists(id);

    const updated = await this.prisma.lead.update({
      where: { id },
      data: {
        ...payload,
      },
    });

    await this.prisma.activityLog.create({
      data: {
        action: 'lead.updated',
        context: { leadId: updated.id },
      },
    });

    this.logger.log(`Updated lead ${updated.id}`, LeadsService.name);
    return updated;
  }

  async softDelete(id: string) {
    await this.ensureExists(id);

    const deleted = await this.prisma.lead.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    await this.prisma.activityLog.create({
      data: {
        action: 'lead.deleted',
        context: { leadId: deleted.id },
      },
    });

    this.logger.log(`Soft-deleted lead ${deleted.id}`, LeadsService.name);
    return { success: true };
  }

  private async ensureExists(id: string) {
    const lead = await this.prisma.lead.findFirst({ where: { id, deletedAt: null } });
    if (!lead) throw new NotFoundException('Lead not found');
    return lead;
  }

  private scoreLead(payload: CreateLeadDto): number {
    let score = 50;
    if (payload.websiteUrl && payload.websiteUrl.includes('.io')) score += 10;
    if (payload.company.toLowerCase().includes('labs')) score += 5;
    return Math.max(0, Math.min(100, score));
  }
}
