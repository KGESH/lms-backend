import { UiRepeatTimerDto } from '@src/v1/ui/component/repeat-timer/ui-repeat-timer.dto';
import { UiCarouselMainBannerWithContentsDto } from '@src/v1/ui/component/carousel/carousel-main-banner/ui-carousel-main-banner.dto';
import { UiCarouselReviewWithItemsDto } from '@src/v1/ui/component/carousel/carousel-review/ui-carousel-review.dto';

export type IUiComponentGroup = {
  banners: unknown[];
  marketingBanners: unknown[];
  repeatTimers: UiRepeatTimerDto[];
  carousel: {
    mainBannerCarousels: UiCarouselMainBannerWithContentsDto[];
    reviewCarousels: UiCarouselReviewWithItemsDto[];
    productCarousels: unknown[];
  };
};
