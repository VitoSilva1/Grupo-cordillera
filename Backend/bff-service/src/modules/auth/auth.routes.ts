import { Router } from 'express';

import { createProxyHandler } from '../../shared/http/proxy.js';

export function createAuthRouter(authApiUrl: string): Router {
  const router = Router();

  router.use(createProxyHandler(authApiUrl));

  return router;
}
