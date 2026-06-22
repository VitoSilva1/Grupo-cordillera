import { Module } from '@nestjs/common';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { ReportClient } from '../../clients/report.client';

@Module({
  controllers: [ReportsController],
  providers: [ReportsService, ReportClient],
})
export class ReportsModule {}
