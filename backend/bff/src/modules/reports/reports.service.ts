import { Injectable, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import * as Sentry from '@sentry/node';
import { ReportClient } from '../../clients/report.client';

@Injectable()
export class ReportsService {
  private readonly logger = new Logger(ReportsService.name);
  private createdReportCount = 0;

  constructor(private readonly reportClient: ReportClient) {}

  async proxy(request: Request, response: Response): Promise<void> {
    const result = await this.reportClient.proxy(request, response);

    if (request.method === 'POST' && result.status >= 200 && result.status < 300) {
      this.createdReportCount += 1;

      this.logger.log(
        `business_metric=report_created total_reports_created=${this.createdReportCount}`,
      );

      Sentry.withScope((scope) => {
        scope.setLevel('info');
        scope.setTag('business_metric', 'report_created');
        scope.setTag('feature', 'reports');
        scope.setContext('business_metric', {
          totalReportsCreated: this.createdReportCount,
        });
        scope.setFingerprint(['business_metric', 'report_created']);
        Sentry.captureMessage('Reporte creado');
      });
    }
  }
}
