import { Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import { servicesConfig } from '../config/services.config';
import { ProxyResult, proxyRequest } from '../common/utils/http-client';

@Injectable()
export class KpisClient {
  proxy(request: Request, response: Response): Promise<ProxyResult> {
    return proxyRequest(request, response, servicesConfig.kpisApiUrl, '/api/kpis');
  }
}
