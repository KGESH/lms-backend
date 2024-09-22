import { Module } from '@nestjs/common';
import { UiComponentModule } from '@src/v1/ui/component/ui-component.module';
import { UiRepeatTimerModule } from '@src/v1/ui/component/repeat-timer/ui-repeat-timer.module';
import { UiCarouselReviewModule } from '@src/v1/ui/component/carousel/carousel-review/ui-carousel-review.module';
import { UiCarouselMainBannerModule } from '@src/v1/ui/component/carousel/carousel-main-banner/ui-carousel-main-banner.module';

@Module({
  imports: [
    UiComponentModule,
    UiRepeatTimerModule,
    UiCarouselReviewModule,
    UiCarouselMainBannerModule,
  ],
})
export class UiModule {}
