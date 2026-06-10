import type { RequestHandler } from 'express';

import type { CreateUserRequest } from './users.dto.js';
import { UsersService } from './users.service.js';

export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  createUser: RequestHandler = async (req, res, next) => {
    try {
      const user = await this.usersService.createUser(req.body as CreateUserRequest);
      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  };
}
