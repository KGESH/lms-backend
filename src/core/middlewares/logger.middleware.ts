import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction): void {
    const { ip, method, originalUrl, body, params, query, headers } = request;

    this.logger.log(
      `[REQUEST] ${method} ${originalUrl}\n` +
        `Params: ${JSON.stringify(params, null, 2)}\n` +
        `Query: ${JSON.stringify(query, null, 2).replace(/,/g, ',\n')}\n` +
        `Body: { \n` +
        Object.keys(body)
          .map((key) => `  "${key}": ${JSON.stringify(body[key], null, 2)}`)
          .join(',\n') +
        `\n}\n` +
        `Headers: {\n` +
        Object.keys(headers)
          .map((key) => `  "${key}": "${headers[key]}"`)
          .join(',\n') +
        `\n}\n` +
        `ip: ${ip}\n`,
    );

    response.on('finish', () => {
      const { statusCode } = response;
      const log = `[RESPONSE] ${method} ${statusCode} ${originalUrl}`;

      if (statusCode >= 400) {
        this.logger.error(log);
      } else {
        this.logger.log(log);
      }
    });

    next();
  }
}
