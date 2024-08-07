import { Module } from '@nestjs/common';
import { UiRepeatTimerQueryRepository } from './ui-repeat-timer-query.repository';
import { UiRepeatTimerController } from './ui-repeat.controller';
import { UiRepeatTimerService } from './ui-repeat-timer.service';
import { UiComponentModule } from '../ui-component.module';
import { UiRepeatTimerComponentRepository } from './ui-repeat-timer-component.repository';

const providers = [
  UiRepeatTimerService,
  UiRepeatTimerQueryRepository,
  UiRepeatTimerComponentRepository,
];

@Module({
  imports: [UiComponentModule],
  controllers: [UiRepeatTimerController],
  providers: [...providers],
  exports: [...providers],
})
export class UiRepeatTimerModule {}
