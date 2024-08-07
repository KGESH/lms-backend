import { Uuid } from '../../../../../shared/types/primitive';

export type IUiCarouselReview = {
  id: Uuid;
  uiComponentId: Uuid;
  uiCarouselId: Uuid;
  title: string;
  content: string;
  rating: number;
};
