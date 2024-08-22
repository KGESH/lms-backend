import { Uuid } from '@src/shared/types/primitive';
import { Optional } from '@src/shared/types/optional';

export type ICategory = {
  id: Uuid;
  parentId: Uuid | null;
  name: string;
  description: string | null;
};

export type ICategoryWithChildren = ICategory & {
  children: Array<ICategoryWithChildren>;
};

export type ICategoryCreate = Optional<ICategory, 'id'>;

export type ICategoryUpdate = Omit<Partial<ICategoryCreate>, 'id'>;

export type ICategoryWithRelations = ICategory & {
  depth: number;
  parent: ICategory | null;
  children: Array<ICategoryWithRelations>;
};
