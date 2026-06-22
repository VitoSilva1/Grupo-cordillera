import { Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { JwtGuard } from '../../common/guards/jwt.guard';
import { UsersService } from './users.service';

@Controller('api/users')
@UseGuards(JwtGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Req() request: Request, @Res() response: Response): Promise<void> {
    return this.usersService.proxy(request, response);
  }
}
