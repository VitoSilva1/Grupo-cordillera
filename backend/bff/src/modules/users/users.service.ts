import { Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import { UserClient } from '../../clients/user.client';

@Injectable()
export class UsersService {
  constructor(private readonly userClient: UserClient) {}

  async proxy(request: Request, response: Response): Promise<void> {
    await this.userClient.proxy(request, response);
  }
}
