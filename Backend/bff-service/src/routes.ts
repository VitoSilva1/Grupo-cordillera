import { Router } from 'express';

import { env } from './config/env.js';
import { createAuthRouter } from './modules/auth/auth.routes.js';
import { createDashboardRouter } from './modules/dashboard/dashboard.routes.js';
import { createHealthRouter } from './modules/health/health.routes.js';
import { createKpisRouter } from './modules/kpis/kpis.routes.js';
import { createUsersRouter } from './modules/users/users.routes.js';

export function createRoutes(): Router {
  const router = Router();

  router.use(createHealthRouter());
  router.use('/api/dashboard', createDashboardRouter(env.kpisApiUrl));
  router.use('/api/auth', createAuthRouter(env.authApiUrl));
  router.use('/api/kpis', createKpisRouter(env.kpisApiUrl));
  router.use('/api/users', createUsersRouter(env.userApiUrl, env.authApiUrl));

  return router;
}
