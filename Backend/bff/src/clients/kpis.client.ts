import { Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import { servicesConfig } from '../config/services.config';
import { getJson, proxyRequest } from '../common/utils/http-client';
import {
  Alert,
  BranchPerformance,
  KpiSummary,
  MonthlySales,
  SalesChannel,
} from '../interfaces/kpi.interface';

@Injectable()
export class KpisClient {
  proxy(request: Request, response: Response): Promise<void> {
    return proxyRequest(request, response, servicesConfig.kpisApiUrl, '/api/kpis');
  }

  getSummary(): Promise<KpiSummary> {
    return getJson<KpiSummary>(`${servicesConfig.kpisApiUrl}/summary`);
  }

  getMonthlySales(): Promise<MonthlySales[]> {
    return getJson<MonthlySales[]>(`${servicesConfig.kpisApiUrl}/sales/monthly`);
  }

  getBranchPerformance(): Promise<BranchPerformance[]> {
    return getJson<BranchPerformance[]>(`${servicesConfig.kpisApiUrl}/branches/performance`);
  }

  getSalesChannels(): Promise<SalesChannel[]> {
    return getJson<SalesChannel[]>(`${servicesConfig.kpisApiUrl}/channels`);
  }

  getAlerts(): Promise<Alert[]> {
    return getJson<Alert[]>(`${servicesConfig.kpisApiUrl}/alerts`);
  }
}
