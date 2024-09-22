import { CarouselContentType, UInt, Uuid } from '@src/shared/types/primitive';

export type UiCarouselContentDto = {
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

export type UiCarouselContentCreateDto = Omit<
  UiCarouselContentDto,
  'id' | 'uiCarouselId'
>;

export type UiCarouselContentUpdateDto = Partial<UiCarouselContentCreateDto>;
