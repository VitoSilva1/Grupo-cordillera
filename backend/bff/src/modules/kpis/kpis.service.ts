import { Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import { KpisClient } from '../../clients/kpis.client';

@Injectable()
export class KpisService {
  constructor(private readonly kpisClient: KpisClient) {}

  async proxy(request: Request, response: Response): Promise<void> {
    await this.kpisClient.proxy(request, response);
  }
}
