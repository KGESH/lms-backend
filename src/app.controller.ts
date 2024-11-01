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

  /**
   * Backend SDK Version
   *
   * @tag ping
   * @summary Backend SDK Version (public)
   */
  @Get('sdk-version')
  @SkipAuth()
  @SkipApiGuard()
  async getBackendSDKVersion(): Promise<string> {
    this.logger.verbose('getBackendSDKVersion');
    return await this.appService.getBackendSDKVersion();
  }
}
