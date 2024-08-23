import { Controller, Get } from '@nestjs/common';
import { AppService } from '@src/app.service';
import { SkipAuth } from '@src/core/decorators/skip-auth.decorator';
import { SkipApiGuard } from '@src/core/decorators/skip-api-guard';

@Controller()
export class AppController {
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
    return this.appService.ping();
  }
}
