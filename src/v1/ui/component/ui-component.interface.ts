import { UInt, Uuid } from '@src/shared/types/primitive';
import { UiCategory } from '@src/v1/ui/category/ui-category.interface';
import { Optional } from '@src/shared/types/optional';

export type IUiComponentBase = {
  id: Uuid;
  category: UiCategory;
  name: string;
  path: string;
  sequence: UInt;
  description: string | null;
};

export type IUiComponentBaseCreate = Optional<IUiComponentBase, 'id'>;

export type IUiComponentBaseUpdate = Partial<Omit<IUiComponentBase, 'id'>>;

export type IUiComponent<C extends UiCategory, U> = IUiComponentBase & {
  category: C;
  ui: U;
};

export type IUiComponentQuery = Pick<IUiComponentBase, 'path'>;

export type IUiSectionGroupBase = Record<
  IUiComponentBase['category'],
  IUiComponentBase[]
>;

export type IUiComponentGroup<C extends UiCategory, T> = Record<C, T>;
