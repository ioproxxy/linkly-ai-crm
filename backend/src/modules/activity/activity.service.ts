import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infra/prisma/prisma.service';

@Injectable()
export class ActivityService {
  constructor(private prisma: PrismaService) {}

  listForUser(userId: string, limit = 100) {
    return this.prisma.activityLog.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  listAiActions(userId: string, limit = 100) {
    return this.prisma.aiActionLog.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  listCampaignExecutions(campaignId: string, limit = 100) {
    return this.prisma.campaignExecutionLog.findMany({
      where: { campaignId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }
}
