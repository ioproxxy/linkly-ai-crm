import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../infra/prisma/prisma.service';
import { AppLogger } from '../logging/logging.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';

@Injectable()
export class CampaignsService {
  constructor(private prisma: PrismaService, private logger: AppLogger) {}

  async listForUser(userId: string) {
    return this.prisma.campaign.findMany({
      where: { ownerId: userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getForUser(userId: string, id: string) {
    const campaign = await this.prisma.campaign.findFirst({ where: { id, ownerId: userId } });
    if (!campaign) throw new NotFoundException('Campaign not found');
    return campaign;
  }

  async create(userId: string, payload: CreateCampaignDto) {
    const campaign = await this.prisma.campaign.create({
      data: {
        name: payload.name,
        status: 'Active',
        ownerId: userId,
      },
    });

    await this.prisma.activityLog.create({
      data: {
        userId,
        action: 'campaign.created',
        context: { campaignId: campaign.id },
      },
    });

    this.logger.log(`Created campaign ${campaign.id}`, CampaignsService.name);
    return campaign;
  }

  async update(userId: string, id: string, payload: UpdateCampaignDto) {
    await this.ensureExists(userId, id);

    const updated = await this.prisma.campaign.update({
      where: { id },
      data: {
        ...payload,
      },
    });

    await this.prisma.activityLog.create({
      data: {
        userId,
        action: 'campaign.updated',
        context: { campaignId: updated.id },
      },
    });

    this.logger.log(`Updated campaign ${updated.id}`, CampaignsService.name);
    return updated;
  }

  async pause(userId: string, id: string) {
    return this.setStatus(userId, id, 'Paused');
  }

  async resume(userId: string, id: string) {
    return this.setStatus(userId, id, 'Active');
  }

  async kill(userId: string, id: string) {
    return this.setStatus(userId, id, 'Killed');
  }

  private async setStatus(userId: string, id: string, status: string) {
    await this.ensureExists(userId, id);

    const updated = await this.prisma.campaign.update({
      where: { id },
      data: { status },
    });

    await this.prisma.campaignExecutionLog.create({
      data: {
        campaignId: updated.id,
        phase: 'lifecycle',
        status,
        details: { reason: 'status_change' },
      },
    });

    await this.prisma.activityLog.create({
      data: {
        userId,
        action: 'campaign.status_changed',
        context: { campaignId: updated.id, status },
      },
    });

    this.logger.log(`Campaign ${updated.id} status -> ${status}`, CampaignsService.name);
    return updated;
  }

  private async ensureExists(userId: string, id: string) {
    const campaign = await this.prisma.campaign.findFirst({ where: { id, ownerId: userId } });
    if (!campaign) throw new NotFoundException('Campaign not found');
    return campaign;
  }
}
