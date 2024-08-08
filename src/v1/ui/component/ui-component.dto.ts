import { UiCategory } from '../category/ui-category.interface';
import { UInt } from '../../../shared/types/primitive';

export type UiComponentDto<C extends UiCategory, T> = {
  name: string;
  category: C;
  path: string;
  sequence: UInt;
  description: string | null;
  ui: T;
};
