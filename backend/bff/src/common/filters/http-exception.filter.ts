import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ErrorResponseDto } from '../dto/error-response.dto';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const message =
      exception instanceof Error ? exception.message : 'Unexpected BFF error';

    const payload: ErrorResponseDto = {
      code: status >= 500 ? 'BFF_INTERNAL_ERROR' : 'BFF_REQUEST_ERROR',
      message,
      statusCode: status,
      timestamp: new Date().toISOString(),
    };

    response.status(status).json(payload);
  }
}
