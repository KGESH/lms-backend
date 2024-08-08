import { Module } from '@nestjs/common';
import { UiComponentModule } from './component/ui-component.module';
import { UiRepeatTimerModule } from './component/repeat-timer/ui-repeat-timer.module';
import { UiCarouselReviewModule } from './component/carousel/carousel-review/ui-carousel-review.module';

@Module({
  imports: [UiComponentModule, UiRepeatTimerModule, UiCarouselReviewModule],
})
export class UiModule {}
