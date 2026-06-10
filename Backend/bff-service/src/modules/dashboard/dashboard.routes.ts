import { Router } from 'express';

import { DashboardClient } from './dashboard.client.js';
import { DashboardController } from './dashboard.controller.js';
import { DashboardService } from './dashboard.service.js';

export function createDashboardRouter(kpisApiUrl: string): Router {
  const router = Router();
  const client = new DashboardClient(kpisApiUrl);
  const service = new DashboardService(client);
  const controller = new DashboardController(service);

  router.get('/', controller.getDashboard);

  return router;
}
