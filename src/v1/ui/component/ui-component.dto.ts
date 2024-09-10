import { UiCategory } from '@src/v1/ui/category/ui-category.interface';
import { UInt, Uuid } from '@src/shared/types/primitive';

export type UiComponentBaseDto = {
  id: Uuid;
  name: string;
  category: UiCategory;
  path: string;
  sequence: UInt;
  description: string | null;
};

export type UiComponentDto<C extends UiCategory, T> = {
  name: string;
  category: C;
  path: string;
  sequence: UInt;
  description: string | null;
  ui: T;
};

export type UiComponentQuery = Pick<UiComponentBaseDto, 'path'>;

export type UiComponentGroupDto<C extends UiCategory, T> = Record<C, T>;
