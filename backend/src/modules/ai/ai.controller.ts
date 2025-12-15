import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AiService } from './ai.service';
import { AnalyzeLeadDto } from './dto/analyze-lead.dto';
import { ChatCommandDto } from './dto/chat-command.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';

@UseGuards(JwtAuthGuard, ThrottlerGuard)
@Controller('ai')
export class AiController {
  constructor(private readonly ai: AiService) {}

  @Post('analyze-lead')
  @Throttle(20, 60)
  analyzeLead(@Req() req: any, @Body() payload: AnalyzeLeadDto) {
    return this.ai.analyzeLead(payload, req.user.userId);
  }

  @Post('command')
  @Throttle(10, 60)
  command(@Req() req: any, @Body() payload: ChatCommandDto) {
    return this.ai.chatCommand(payload, req.user.userId);
  }
}
