import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import * as date from '@src/shared/utils/date';
import { IErrorResponse } from '@src/shared/types/response';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const statusCode = exception.getStatus();
    const message = exception.message;
    const timestamp = date.now('iso');
    const path = request.url;

    this.logger.log(request.url);
    this.logger.log(statusCode);
    this.logger.log(message);

    response.status(statusCode).json({
      path,
      message,
      timestamp,
      statusCode,
    } satisfies IErrorResponse<typeof statusCode>);
  }
}
