import { UInt, Uuid } from '@src/shared/types/primitive';
import {
  CreateUiCarouselDto,
  UiCarouselDto,
} from '@src/v1/ui/component/carousel/ui-carousel.dto';
import { UiCarouselReview } from '@src/v1/ui/category/ui-category.interface';
import { RequiredField } from '@src/shared/types/required-field';

export type UiCarouselReviewItemDto = {
  id: Uuid;
  uiCarouselId: Uuid;
  sequence: UInt;
  title: string;
  content: string;
  rating: number;
};

export type CreateUiCarouselReviewItemDto = Omit<
  UiCarouselReviewItemDto,
  'id' | 'uiCarouselId'
>;

export type UpdateUiCarouselReviewItemDto = RequiredField<
  Partial<Omit<UiCarouselReviewItemDto, 'uiCarouselId'>>,
  'id'
>;

export type CreateUiCarouselReviewDto = CreateUiCarouselDto<UiCarouselReview>;

export type UiCarouselReviewWithItemsDto = {
  uiCarousel: UiCarouselDto<UiCarouselReview>;
  uiCarouselReviewItems: UiCarouselReviewItemDto[];
};

export type DeleteUiCarouselReviewItemsQuery = {
  ids: UiCarouselReviewItemDto['id'][];
};
