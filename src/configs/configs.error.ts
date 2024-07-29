import { Logger } from '@nestjs/common';

export class ConfigError extends Error {
  private readonly logger = new Logger(ConfigError.name);
  constructor(message: string, e?: unknown) {
    super(message);
    this.name = 'ConfigError';
    this.logger.error(message, e);
  }
}
