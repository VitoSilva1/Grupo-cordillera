import { All, Controller, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { JwtGuard } from '../../common/guards/jwt.guard';
import { ReportsService } from './reports.service';

@Controller('api/reports')
@UseGuards(JwtGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @All()
  proxyRoot(@Req() request: Request, @Res() response: Response): Promise<void> {
    return this.reportsService.proxy(request, response);
  }

  @All('*')
  proxy(@Req() request: Request, @Res() response: Response): Promise<void> {
    return this.reportsService.proxy(request, response);
  }
}
