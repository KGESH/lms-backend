import { IUiRepeatTimerComponent } from '@src/v1/ui/component/repeat-timer/ui-repeat-timer.interface';
import { IUiCarouselMainBannerWithContents } from '@src/v1/ui/component/carousel/carousel-main-banner/ui-carousel-main-banner.interface';
import { IUiCarouselReviewWithItems } from '@src/v1/ui/component/carousel/carousel-review/ui-carousel-review.interface';
import { IUiBannerComponent } from '@src/v1/ui/component/banner/ui-banner.interface';
import { IUiMarketingBannerComponent } from '@src/v1/ui/component/marketing-banner/ui-marketing-banner.interface';
import { IUiPopupComponent } from '@src/v1/ui/component/popup/ui-popup.interface';

export type IUiComponentGroupItem =
  | IUiRepeatTimerComponent
  | IUiBannerComponent
  | IUiMarketingBannerComponent
  | IUiCarouselMainBannerWithContents
  | IUiCarouselReviewWithItems;

export type IUiComponents = {
  banners: IUiBannerComponent[];
  marketingBanners: IUiMarketingBannerComponent[];
  repeatTimers: IUiRepeatTimerComponent[];
  popups: IUiPopupComponent[];
  carousel: {
    mainBannerCarousels: IUiCarouselMainBannerWithContents[];
    reviewCarousels: IUiCarouselReviewWithItems[];
    productCarousels: unknown[];
  };
};
