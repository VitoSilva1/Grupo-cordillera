import { Router } from 'express';

import { createProxyHandler } from '../../shared/http/proxy.js';

export function createKpisRouter(kpisApiUrl: string): Router {
  const router = Router();

  router.use(createProxyHandler(kpisApiUrl));

  return router;
}
