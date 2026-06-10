import type { RequestHandler } from 'express';

import { DashboardService } from './dashboard.service.js';

export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  getDashboard: RequestHandler = async (_req, res, next) => {
    try {
      const dashboard = await this.dashboardService.getDashboard();
      res.json(dashboard);
    } catch (error) {
      next(error);
    }
  };
}
