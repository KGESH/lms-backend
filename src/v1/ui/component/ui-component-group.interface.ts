import { IUiRepeatTimerComponent } from '@src/v1/ui/component/repeat-timer/ui-repeat-timer.interface';
import { IUiCarouselMainBannerWithContents } from '@src/v1/ui/component/carousel/carousel-main-banner/ui-carousel-main-banner.interface';
import { IUiCarouselReviewWithItems } from '@src/v1/ui/component/carousel/carousel-review/ui-carousel-review.interface';

export type IUiComponentGroupItem =
  | IUiRepeatTimerComponent
  | IUiCarouselMainBannerWithContents
  | IUiCarouselReviewWithItems;

export type IUiComponentGroup = {
  banners: unknown[];
  marketingBanners: unknown[];
  repeatTimers: IUiRepeatTimerComponent[];
  carousel: {
    mainBannerCarousels: IUiCarouselMainBannerWithContents[];
    reviewCarousels: IUiCarouselReviewWithItems[];
    productCarousels: unknown[];
  };
};
