import { Uuid } from '@src/shared/types/primitive';

export type IUiCarouselProduct = {
  id: Uuid;
  uiComponentId: Uuid;
  uiCarouselId: Uuid;
  title: string;
  price: number;
  imageUrl: string;
  imageAlt: string | null;
};
