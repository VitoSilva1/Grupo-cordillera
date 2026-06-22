import { All, Controller, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { JwtGuard } from '../../common/guards/jwt.guard';
import { AuthService } from './auth.service';

@Controller('api/auth')
@UseGuards(JwtGuard)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @All()
  proxyRoot(@Req() request: Request, @Res() response: Response): Promise<void> {
    return this.authService.proxy(request, response);
  }

  @All('*')
  proxy(@Req() request: Request, @Res() response: Response): Promise<void> {
    return this.authService.proxy(request, response);
  }
}
