import { UiCategory } from '../category/ui-category.interface';
import { UInt, Uuid } from '../../../shared/types/primitive';

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
