import { Controller, Get, Post, Body, Param, Query, Patch, Delete, UseGuards } from '@nestjs/common';
import { LeadsService } from './leads.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';

@UseGuards(JwtAuthGuard, ThrottlerGuard)
@Controller('leads')
export class LeadsController {
  constructor(private readonly leads: LeadsService) {}

  @Get()
  @Throttle(30, 60)
  list(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('campaignId') campaignId?: string,
  ) {
    return this.leads.list({
      skip: skip ? Number(skip) : undefined,
      take: take ? Number(take) : undefined,
      campaignId,
    });
  }

  @Get(':id')
  @Throttle(60, 60)
  get(@Param('id') id: string) {
    return this.leads.get(id);
  }

  @Post()
  @Throttle(20, 60)
  create(@Body() payload: CreateLeadDto) {
    return this.leads.create(payload);
  }

  @Patch(':id')
  @Throttle(30, 60)
  update(@Param('id') id: string, @Body() payload: UpdateLeadDto) {
    return this.leads.update(id, payload);
  }

  @Delete(':id')
  @Throttle(10, 60)
  delete(@Param('id') id: string) {
    return this.leads.softDelete(id);
  }
}
