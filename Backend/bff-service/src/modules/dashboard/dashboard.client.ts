import { HttpClient } from '../../shared/http/http-client.js';

export class DashboardClient {
  private readonly http: HttpClient;

  constructor(kpisApiUrl: string) {
    this.http = new HttpClient(kpisApiUrl);
  }

  getSummary() {
    return this.http.get<unknown>('/summary');
  }

  getMonthlySales() {
    return this.http.get<unknown>('/sales/monthly');
  }

  getBranchesPerformance() {
    return this.http.get<unknown>('/branches/performance');
  }

  getChannels() {
    return this.http.get<unknown>('/channels');
  }

  getAlerts() {
    return this.http.get<unknown>('/alerts');
  }
}
