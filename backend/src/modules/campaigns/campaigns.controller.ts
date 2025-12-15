import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { CampaignsService } from './campaigns.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';

@UseGuards(JwtAuthGuard, ThrottlerGuard)
@Controller('campaigns')
export class CampaignsController {
  constructor(private readonly campaigns: CampaignsService) {}

  @Get()
  @Throttle(30, 60)
  list(@Req() req: any) {
    return this.campaigns.listForUser(req.user.userId);
  }

  @Get(':id')
  @Throttle(60, 60)
  get(@Req() req: any, @Param('id') id: string) {
    return this.campaigns.getForUser(req.user.userId, id);
  }

  @Post()
  @Throttle(10, 60)
  create(@Req() req: any, @Body() payload: CreateCampaignDto) {
    return this.campaigns.create(req.user.userId, payload);
  }

  @Patch(':id')
  @Throttle(20, 60)
  update(@Req() req: any, @Param('id') id: string, @Body() payload: UpdateCampaignDto) {
    return this.campaigns.update(req.user.userId, id, payload);
  }

  @Patch(':id/pause')
  @Throttle(10, 60)
  pause(@Req() req: any, @Param('id') id: string) {
    return this.campaigns.pause(req.user.userId, id);
  }

  @Patch(':id/resume')
  @Throttle(10, 60)
  resume(@Req() req: any, @Param('id') id: string) {
    return this.campaigns.resume(req.user.userId, id);
  }

  @Patch(':id/kill')
  @Throttle(5, 60)
  kill(@Req() req: any, @Param('id') id: string) {
    return this.campaigns.kill(req.user.userId, id);
  }
}
