import { Uuid } from '../../../shared/types/primitive';
import { UiCategory } from '../category/ui-category.interface';

export type IUiComponentBase = {
  id: Uuid;
  category: UiCategory;
  name: string;
  path: string;
  sequence: number;
  description: string | null;
};

export type IUiComponentBaseCreate = Partial<Pick<IUiComponentBase, 'id'>> &
  Pick<
    IUiComponentBase,
    'category' | 'name' | 'path' | 'sequence' | 'description'
  >;

export type IUiComponentBaseUpdate = Partial<Omit<IUiComponentBase, 'id'>>;

export type IUiComponent<C, U> = IUiComponentBase & {
  category: C;
  ui: U;
};

export type IUiComponentQuery = Pick<IUiComponentBase, 'path'>;

export type IUiSectionGroupBase = Record<
  IUiComponentBase['category'],
  IUiComponentBase[]
>;

export type IUiComponentGroup<
  C extends IUiComponentBase['category'],
  T,
> = Record<C, T>;
