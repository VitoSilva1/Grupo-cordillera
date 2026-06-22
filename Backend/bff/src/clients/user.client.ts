import { Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import { servicesConfig } from '../config/services.config';
import { getJson, proxyRequest } from '../common/utils/http-client';
import { UserProfile } from '../interfaces/user.interface';

@Injectable()
export class UserClient {
  proxy(request: Request, response: Response): Promise<void> {
    return proxyRequest(request, response, servicesConfig.userApiUrl, '/api/users');
  }

  getCurrentUser(): Promise<UserProfile> {
    return getJson<UserProfile>(`${servicesConfig.authApiUrl}/users/me`);
  }
}
