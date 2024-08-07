import { UiRepeatTimer } from '../category/ui-category.interface';
import { UInt } from '../../../shared/types/primitive';

export type UiComponentDto<T> = {
  name: string;
  category: UiRepeatTimer;
  sequence: UInt;
  description: string | null;
  ui: T;
};
