import { Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthClient } from '../../clients/auth.client';

@Injectable()
export class AuthService {
  constructor(private readonly authClient: AuthClient) {}

  proxy(request: Request, response: Response): Promise<void> {
    return this.authClient.proxy(request, response);
  }
}
