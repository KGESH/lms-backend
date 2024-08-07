import { Uuid } from '../../../shared/types/primitive';
import { UiCategory } from '../category/ui-category.interface';

export type IUiComponentBase = {
  id: Uuid;
  category: UiCategory;
  name: string;
  sequence: number;
  description: string | null;
};

export type IUiComponentBaseCreate = Partial<Pick<IUiComponentBase, 'id'>> &
  Pick<IUiComponentBase, 'category' | 'name' | 'sequence' | 'description'>;

export type IUiComponentBaseUpdate = Partial<Omit<IUiComponentBase, 'id'>>;

export type IUiComponent<C, U> = IUiComponentBase & {
  category: C;
  ui: U;
};
