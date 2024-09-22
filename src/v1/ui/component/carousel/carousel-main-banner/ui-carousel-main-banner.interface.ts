import { IUiCarouselComponent } from '@src/v1/ui/component/carousel/ui-carousel.interface';
import { UiCarouselMainBanner } from '@src/v1/ui/category/ui-category.interface';
import { IUiCarouselContent } from '@src/v1/ui/component/carousel/carousel-content/ui-carousel-content.interface';

export type IUiCarouselMainBannerWithContents = {
  uiCarousel: IUiCarouselComponent<UiCarouselMainBanner>;
  contents: IUiCarouselContent[];
};
