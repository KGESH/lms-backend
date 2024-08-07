import { Module } from '@nestjs/common';
import { UiComponentModule } from './component/ui-component.module';
import { UiRepeatTimerModule } from './component/repeat-timer/ui-repeat-timer.module';

@Module({
  imports: [UiComponentModule, UiRepeatTimerModule],
})
export class UiModule {}
