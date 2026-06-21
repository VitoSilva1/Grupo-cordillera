import { Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import { servicesConfig } from '../config/services.config';
import { getJson, proxyRequest } from '../common/utils/http-client';
import { Report } from '../interfaces/report.interface';

@Injectable()
export class ReportClient {
  proxy(request: Request, response: Response): Promise<void> {
    return proxyRequest(request, response, servicesConfig.reportApiUrl, '/api/reports');
  }

  getLatestReports(): Promise<Report[]> {
    return getJson<Report[]>(servicesConfig.reportApiUrl);
  }
}
