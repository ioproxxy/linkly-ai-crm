import { Controller, Get, Param, Query, Req, UseGuards } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';

@UseGuards(JwtAuthGuard, ThrottlerGuard)
@Controller('activity')
export class ActivityController {
  constructor(private readonly activity: ActivityService) {}

  @Get('events')
  @Throttle(30, 60)
  events(@Req() req: any, @Query('limit') limit?: string) {
    return this.activity.listForUser(req.user.userId, limit ? Number(limit) : 100);
  }

  @Get('ai')
  @Throttle(30, 60)
  ai(@Req() req: any, @Query('limit') limit?: string) {
    return this.activity.listAiActions(req.user.userId, limit ? Number(limit) : 100);
  }

  @Get('campaigns/:id')
  @Throttle(30, 60)
  campaignExecutions(@Param('id') id: string, @Query('limit') limit?: string) {
    return this.activity.listCampaignExecutions(id, limit ? Number(limit) : 100);
  }
}
