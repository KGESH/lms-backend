import { Uuid } from '@src/shared/types/primitive';
import {
  CreateUiCarouselDto,
  UiCarouselDto,
} from '@src/v1/ui/component/carousel/ui-carousel.dto';
import { UiCarouselMainBanner } from '@src/v1/ui/category/ui-category.interface';
import { UiCarouselContentDto } from '@src/v1/ui/component/carousel/carousel-content/ui-carousel-content.dto';

export type UiCarouselMainBannerWithContentsDto = {
  uiCarousel: UiCarouselDto<UiCarouselMainBanner>;
  contents: UiCarouselContentDto[];
};

export type CreateUiCarouselMainBannerContentDto = Omit<
  UiCarouselContentDto,
  'id' | 'uiCarouselId'
>;

export type CreateUiCarouselMainBannerDto =
  CreateUiCarouselDto<UiCarouselMainBanner> & {
    carouselContentParams: CreateUiCarouselMainBannerContentDto[];
  };

export type UiCarouselMainBannerQuery = {
  uiComponentId: Uuid;
};

export type DeleteUiCarouselMainBannerItems = {
  ids: UiCarouselContentDto['id'][];
};
