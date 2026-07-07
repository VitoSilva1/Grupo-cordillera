import { Module } from '@nestjs/common';
import { SentryModule } from '@sentry/nestjs/setup';
import { HealthController } from './modules/health/health.controller';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { KpisModule } from './modules/kpis/kpis.module';
import { ReportsModule } from './modules/reports/reports.module';
import { AuthClient } from './clients/auth.client';
import { UserClient } from './clients/user.client';
import { KpisClient } from './clients/kpis.client';
import { ReportClient } from './clients/report.client';

@Module({
  imports: [
    SentryModule.forRoot(),
    AuthModule,
    UsersModule,
    KpisModule,
    ReportsModule,
  ],
  controllers: [HealthController],
  providers: [AuthClient, UserClient, KpisClient, ReportClient],
  exports: [AuthClient, UserClient, KpisClient, ReportClient],
})
export class AppModule {}
