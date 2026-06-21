import { Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import { KpisClient } from '../../clients/kpis.client';
import { ReportClient } from '../../clients/report.client';
import { UserClient } from '../../clients/user.client';

@Injectable()
export class KpisService {
  constructor(
    private readonly kpisClient: KpisClient,
    private readonly userClient: UserClient,
    private readonly reportClient: ReportClient,
  ) {}

  proxy(request: Request, response: Response): Promise<void> {
    return this.kpisClient.proxy(request, response);
  }

  async getDashboard(): Promise<Record<string, unknown>> {
    const [user, summary, sales, branches, channels, alerts, reports] = await Promise.all([
      this.userClient.getCurrentUser(),
      this.kpisClient.getSummary(),
      this.kpisClient.getMonthlySales(),
      this.kpisClient.getBranchPerformance(),
      this.kpisClient.getSalesChannels(),
      this.kpisClient.getAlerts(),
      this.reportClient.getLatestReports(),
    ]);

    return { user, summary, sales, branches, channels, alerts, reports };
  }
}
