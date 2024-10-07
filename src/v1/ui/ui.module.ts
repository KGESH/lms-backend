import { Module } from '@nestjs/common';
import { UiComponentModule } from '@src/v1/ui/component/ui-component.module';
import { UiRepeatTimerModule } from '@src/v1/ui/component/repeat-timer/ui-repeat-timer.module';
import { UiCarouselReviewModule } from '@src/v1/ui/component/carousel/carousel-review/ui-carousel-review.module';
import { UiCarouselMainBannerModule } from '@src/v1/ui/component/carousel/carousel-main-banner/ui-carousel-main-banner.module';
import { UiBannerModule } from '@src/v1/ui/component/banner/ui-banner.module';
import { UiMarketingBannerModule } from '@src/v1/ui/component/marketing-banner/ui-marketing-banner.module';
import { UiCraftModule } from '@src/v1/ui/craft/ui-craft.module';

const modules = [
  UiComponentModule,
  UiRepeatTimerModule,
  UiCarouselReviewModule,
  UiCarouselMainBannerModule,
  UiBannerModule,
  UiMarketingBannerModule,
  UiCraftModule,
];

@Module({
  imports: [...modules],
  exports: [...modules],
})
export class UiModule {}
