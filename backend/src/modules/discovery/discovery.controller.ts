import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { DiscoveryService } from './discovery.service';
import { DiscoverLeadsDto } from './dto/discover-leads.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';

@UseGuards(JwtAuthGuard, ThrottlerGuard)
@Controller('discovery')
export class DiscoveryController {
  constructor(private readonly discovery: DiscoveryService) {}

  @Post('discover')
  @Throttle(5, 60)
  discover(@Req() req: any, @Body() payload: DiscoverLeadsDto) {
    return this.discovery.enqueueDiscovery(payload, req.user.userId);
  }
}
