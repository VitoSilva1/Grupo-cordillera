import { Module } from '@nestjs/common';
import { KpisController } from './kpis.controller';
import { KpisService } from './kpis.service';
import { KpisClient } from '../../clients/kpis.client';

@Module({
  controllers: [KpisController],
  providers: [KpisService, KpisClient],
})
export class KpisModule {}
