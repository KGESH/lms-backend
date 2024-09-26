import { IUiRepeatTimerComponent } from '@src/v1/ui/component/repeat-timer/ui-repeat-timer.interface';
import { IUiCarouselMainBannerWithContents } from '@src/v1/ui/component/carousel/carousel-main-banner/ui-carousel-main-banner.interface';
import { IUiCarouselReviewWithItems } from '@src/v1/ui/component/carousel/carousel-review/ui-carousel-review.interface';
import { IUiBannerComponent } from '@src/v1/ui/component/banner/ui-banner.interface';
import { IUiMarketingBannerComponent } from '@src/v1/ui/component/marketing-banner/ui-marketing-banner.interface';

export type IUiComponentGroupItem =
  | IUiRepeatTimerComponent
  | IUiBannerComponent
  | IUiMarketingBannerComponent
  | IUiCarouselMainBannerWithContents
  | IUiCarouselReviewWithItems;

export type IUiComponentGroup = {
  banners: IUiBannerComponent[];
  marketingBanners: IUiMarketingBannerComponent[];
  repeatTimers: IUiRepeatTimerComponent[];
  carousel: {
    mainBannerCarousels: IUiCarouselMainBannerWithContents[];
    reviewCarousels: IUiCarouselReviewWithItems[];
    productCarousels: unknown[];
  };
};
