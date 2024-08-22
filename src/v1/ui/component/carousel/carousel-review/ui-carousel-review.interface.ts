import { UInt, Uuid } from '@src/shared/types/primitive';
import { Optional } from '@src/shared/types/optional';
import { IUiCarouselComponent } from '@src/v1/ui/component/carousel/ui-carousel.interface';
import { UiCarouselReview } from '@src/v1/ui/category/ui-category.interface';

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
