import { Module } from '@nestjs/common';
import { UiComponentModule } from '@src/v1/ui/component/ui-component.module';
import { UiRepeatTimerComponentQueryRepository } from '@src/v1/ui/component/repeat-timer/ui-repeat-timer-component-query.repository';
import { UiRepeatTimerController } from '@src/v1/ui/component/repeat-timer/ui-repeat.controller';
import { UiRepeatTimerService } from '@src/v1/ui/component/repeat-timer/ui-repeat-timer.service';
import { UiRepeatTimerComponentRepository } from '@src/v1/ui/component/repeat-timer/ui-repeat-timer-component.repository';

const modules = [UiComponentModule];

const providers = [
  UiRepeatTimerService,
  UiRepeatTimerComponentRepository,
  UiRepeatTimerComponentQueryRepository,
];

@Module({
  imports: [...modules],
  controllers: [UiRepeatTimerController],
  providers: [...providers],
  exports: [...modules, ...providers],
})
export class UiRepeatTimerModule {}
