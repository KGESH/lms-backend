import { Module } from '@nestjs/common';
import { UiComponentModule } from '@src/v1/ui/component/ui-component.module';
import { UiRepeatTimerQueryRepository } from '@src/v1/ui/component/repeat-timer/ui-repeat-timer-query.repository';
import { UiRepeatTimerController } from '@src/v1/ui/component/repeat-timer/ui-repeat.controller';
import { UiRepeatTimerService } from '@src/v1/ui/component/repeat-timer/ui-repeat-timer.service';
import { UiRepeatTimerComponentRepository } from '@src/v1/ui/component/repeat-timer/ui-repeat-timer-component.repository';

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
