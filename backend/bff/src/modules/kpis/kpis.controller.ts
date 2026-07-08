import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { JwtGuard } from '../../common/guards/jwt.guard';
import { KpisService } from './kpis.service';

@Controller()
@UseGuards(JwtGuard)
export class KpisController {
  constructor(private readonly kpisService: KpisService) {}

  @Get('api/kpis/summary')
  getSummary(@Req() request: Request, @Res() response: Response): Promise<void> {
    return this.kpisService.proxy(request, response);
  }

  @Get('api/kpis/sales/monthly')
  getMonthlySales(@Req() request: Request, @Res() response: Response): Promise<void> {
    return this.kpisService.proxy(request, response);
  }

  @Get('api/kpis/branches/performance')
  getBranchPerformance(@Req() request: Request, @Res() response: Response): Promise<void> {
    return this.kpisService.proxy(request, response);
  }

  @Get('api/kpis/channels')
  getSalesChannels(@Req() request: Request, @Res() response: Response): Promise<void> {
    return this.kpisService.proxy(request, response);
  }

  @Get('api/kpis/alerts')
  getAlerts(@Req() request: Request, @Res() response: Response): Promise<void> {
    return this.kpisService.proxy(request, response);
  }
}
