import { All, Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { JwtGuard } from '../../common/guards/jwt.guard';
import { KpisService } from './kpis.service';

@Controller()
@UseGuards(JwtGuard)
export class KpisController {
  constructor(private readonly kpisService: KpisService) {}

  @Get('api/dashboard')
  getDashboard(): Promise<Record<string, unknown>> {
    return this.kpisService.getDashboard();
  }

  @All('api/kpis')
  proxyRoot(@Req() request: Request, @Res() response: Response): Promise<void> {
    return this.kpisService.proxy(request, response);
  }

  @All('api/kpis/*')
  proxy(@Req() request: Request, @Res() response: Response): Promise<void> {
    return this.kpisService.proxy(request, response);
  }
}
