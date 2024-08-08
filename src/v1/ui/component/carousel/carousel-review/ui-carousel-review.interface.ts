import { UInt, Uuid } from '../../../../../shared/types/primitive';
import { Optional } from '../../../../../shared/types/optional';
import { IUiCarouselComponent } from '../ui-carousel.interface';
import { UiCarouselReview } from '../../../category/ui-category.interface';

export type IUiCarouselReview = {
  id: Uuid;
  uiCarouselId: Uuid;
  sequence: UInt;
  title: string;
  content: string;
  rating: number;
};

export type IUiCarouselReviewCreate = Optional<IUiCarouselReview, 'id'>;

export type IUiCarouselReviewUpdate = Partial<IUiCarouselReview>;

export type IUiCarouselReviewWithItems = {
  uiCarousel: IUiCarouselComponent<UiCarouselReview>;
  uiCarouselReviewItems: IUiCarouselReview[];
};
