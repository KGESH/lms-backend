import { UInt, Uuid } from '../../../../../shared/types/primitive';
import { CreateUiCarouselDto, UiCarouselDto } from '../ui-carousel.dto';
import { UiCarouselReview } from '../../../category/ui-category.interface';

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
