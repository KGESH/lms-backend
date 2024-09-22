import { CarouselContentType, UInt, Uuid } from '@src/shared/types/primitive';

export type IUiCarouselContent = {
  id: Uuid;
  uiCarouselId: Uuid;
  type: CarouselContentType;
  sequence: UInt;
  title: string;
  description: string | null;
  contentUrl: string | null;
  linkUrl: string | null;
  metadata: string | null;
};

export type IUiCarouselContentCreate = Omit<IUiCarouselContent, 'id'>;

export type IUiCarouselContentUpdate = Partial<
  Omit<IUiCarouselContent, 'uiCarouselId'>
>;
