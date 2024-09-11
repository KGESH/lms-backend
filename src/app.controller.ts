import { Controller, Get, Logger } from '@nestjs/common';
import { AppService } from '@src/app.service';
import { SkipAuth } from '@src/core/decorators/skip-auth.decorator';
import { SkipApiGuard } from '@src/core/decorators/skip-api.decorator';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);
  constructor(private readonly appService: AppService) {}

  /**
   * Ping
   *
   * @tag ping
   * @summary Ping (public)
   */
  @Get()
  @SkipAuth()
  @SkipApiGuard()
  async ping(): Promise<'pong'> {
    this.logger.verbose('ping');
    return this.appService.ping();
  }
}
