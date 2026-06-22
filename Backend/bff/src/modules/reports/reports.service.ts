import { Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import { ReportClient } from '../../clients/report.client';

@Injectable()
export class ReportsService {
  constructor(private readonly reportClient: ReportClient) {}

  proxy(request: Request, response: Response): Promise<void> {
    return this.reportClient.proxy(request, response);
  }
}
