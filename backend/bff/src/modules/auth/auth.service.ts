import { Injectable, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import * as Sentry from '@sentry/node';
import { AuthClient } from '../../clients/auth.client';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private successfulLoginCount = 0;

  constructor(private readonly authClient: AuthClient) {}

  async proxy(request: Request, response: Response): Promise<void> {
    const result = await this.authClient.proxy(request, response);

    if (request.method === 'POST' && result.status >= 200 && result.status < 300) {
      this.successfulLoginCount += 1;
      const login = typeof request.body?.username === 'string' ? request.body.username : 'unknown';

      this.logger.log(
        `business_metric=login_success total_logins=${this.successfulLoginCount} user=${login}`,
      );

      Sentry.withScope((scope) => {
        scope.setLevel('info');
        scope.setTag('business_metric', 'login_success');
        scope.setTag('feature', 'auth');
        scope.setContext('business_metric', {
          totalLogins: this.successfulLoginCount,
          user: login,
        });
        scope.setFingerprint(['business_metric', 'login_success']);
        Sentry.captureMessage('Login exitoso');
      });
    }
  }
}
