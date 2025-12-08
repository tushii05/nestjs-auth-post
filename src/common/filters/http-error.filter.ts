import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpErrorFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = exception.getStatus?.() || 500;

    const errorResponse = {
      success: false,
      statusCode: status,
      message:
        exception.response?.message ||
        exception.message ||
        'Internal server error',
      errorCode: exception.response?.errorCode || 'SERVER_ERROR',
      path: request.url,
      timestamp: new Date().toISOString(),
      details: exception.response?.details || null,
    };

    response.status(status).json(errorResponse);
  }
}
