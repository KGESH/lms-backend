import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { SkipAuth } from './core/decorators/skip-auth.decorator';
import { SkipApiGuard } from './core/decorators/skip-api-guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @SkipAuth()
  @SkipApiGuard()
  async ping(): Promise<'pong'> {
    return this.appService.ping();
  }
}
