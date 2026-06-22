import { Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import { servicesConfig } from '../config/services.config';
import { proxyRequest } from '../common/utils/http-client';

@Injectable()
export class UserClient {
  proxy(request: Request, response: Response): Promise<void> {
    return proxyRequest(request, response, servicesConfig.userApiUrl, '/api/users');
  }
}
