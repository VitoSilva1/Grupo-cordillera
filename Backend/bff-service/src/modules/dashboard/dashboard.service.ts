import { AppError } from '../../shared/errors/app-error.js';
import type { HttpResult } from '../../shared/http/http-client.js';
import { DashboardClient } from './dashboard.client.js';
import type { DashboardResponse } from './dashboard.dto.js';

export class DashboardService {
  constructor(private readonly client: DashboardClient) {}

  async getDashboard(): Promise<DashboardResponse> {
    const responses = await Promise.all([
      this.client.getSummary(),
      this.client.getMonthlySales(),
      this.client.getBranchesPerformance(),
      this.client.getChannels(),
      this.client.getAlerts(),
    ]);

    const failed = responses.find((response) => !response.ok);
    if (failed) {
      throw new AppError(
        'Error consultando servicios internos',
        502,
        undefined,
        { error: 'Error consultando servicios internos', status: failed.status },
      );
    }

    const [summary, sales, branches, channels, alerts] = responses.map(
      (response: HttpResult<unknown>) => response.data,
    );

    return { summary, sales, branches, channels, alerts };
  }
}
