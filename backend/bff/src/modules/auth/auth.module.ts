import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthClient } from '../../clients/auth.client';

@Module({
  controllers: [AuthController],
  providers: [AuthService, AuthClient],
})
export class AuthModule {}
