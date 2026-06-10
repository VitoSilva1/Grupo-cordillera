import { Router } from 'express';

export function createHealthRouter(): Router {
  const router = Router();

  router.get('/health', (_req, res) => {
    res.json({ status: 'UP', service: 'bff-service' });
  });

  return router;
}
