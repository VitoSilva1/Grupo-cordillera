import { Router } from 'express';

import { createProxyHandler } from '../../shared/http/proxy.js';
import { AuthRegistrationClient } from './auth-registration.client.js';
import { UsersController } from './users.controller.js';
import { UsersClient } from './users.client.js';
import { UsersService } from './users.service.js';

export function createUsersRouter(userApiUrl: string, authApiUrl: string): Router {
  const router = Router();
  const usersClient = new UsersClient(userApiUrl);
  const authRegistrationClient = new AuthRegistrationClient(authApiUrl);
  const usersService = new UsersService(usersClient, authRegistrationClient);
  const usersController = new UsersController(usersService);

  router.post('/', usersController.createUser);
  router.use(createProxyHandler(userApiUrl));

  return router;
}
