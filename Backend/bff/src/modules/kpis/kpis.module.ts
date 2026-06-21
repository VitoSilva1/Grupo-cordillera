import { Module } from '@nestjs/common';
import { KpisController } from './kpis.controller';
import { KpisService } from './kpis.service';
import { KpisClient } from '../../clients/kpis.client';
import { UserClient } from '../../clients/user.client';
import { ReportClient } from '../../clients/report.client';

@Module({
  controllers: [KpisController],
  providers: [KpisService, KpisClient, UserClient, ReportClient],
})
export class KpisModule {}
