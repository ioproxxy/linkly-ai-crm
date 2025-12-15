import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './infra/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
// Placeholder imports for feature modules to be implemented
// in subsequent steps.
// import { LeadsModule } from './modules/leads/leads.module';
// import { CampaignsModule } from './modules/campaigns/campaigns.module';
// import { AiModule } from './modules/ai/ai.module';
// import { DiscoveryModule } from './modules/discovery/discovery.module';
import { LoggingModule } from './modules/logging/logging.module';
import { HealthModule } from './modules/health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    LoggingModule,
    HealthModule,
    AuthModule,
  ],
})
export class AppModule {}
