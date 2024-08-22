import { UInt, Uuid } from '@src/shared/types/primitive';
import {
  CreateUiCarouselDto,
  UiCarouselDto,
} from '@src/v1/ui/component/carousel/ui-carousel.dto';
import { UiCarouselReview } from '@src/v1/ui/category/ui-category.interface';

export type UiCarouselReviewItemDto = {
  id: Uuid;
  uiCarouselId: Uuid;
  sequence: UInt;
  title: string;
  content: string;
  rating: number;
};

export type CreateUiCarouselReviewItemDto = Omit<UiCarouselReviewItemDto, 'id'>;

export type UpdateUiCarouselReviewItemDto =
  Partial<CreateUiCarouselReviewItemDto>;

export type CreateUiCarouselReviewDto = CreateUiCarouselDto<UiCarouselReview>;

export type UiCarouselReviewWithItemsDto = {
  uiCarousel: UiCarouselDto<UiCarouselReview>;
  uiCarouselReviewItems: UiCarouselReviewItemDto[];
};

export type DeleteUiCarouselReviewItemsQuery = {
  ids: UiCarouselReviewItemDto['id'][];
};
