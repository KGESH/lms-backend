import { Uuid } from '../../../../shared/types/primitive';
import { UI_CAROUSEL_CATEGORY_NAME } from './ui-carousel.constant';

export type UiCarousel = typeof UI_CAROUSEL_CATEGORY_NAME;

export type IUiCarousel = {
  id: Uuid;
  uiComponentId: Uuid;
  title: string;
  description: string | null;
};
