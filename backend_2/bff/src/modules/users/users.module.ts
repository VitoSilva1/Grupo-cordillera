import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserClient } from '../../clients/user.client';

@Module({
  controllers: [UsersController],
  providers: [UsersService, UserClient],
})
export class UsersModule {}
