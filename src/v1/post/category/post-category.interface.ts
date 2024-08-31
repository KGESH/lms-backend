import { UInt, Uuid } from '@src/shared/types/primitive';
import { Optional } from '@src/shared/types/optional';

export type IPostCategory = {
  id: Uuid;
  parentId: Uuid | null;
  name: string;
  description: string | null;
};

export type IPostCategoryCreate = Optional<IPostCategory, 'id'>;

export type IPostCategoryUpdate = Omit<Partial<IPostCategory>, 'id'>;

export type IPostCategoryWithRelations = IPostCategory & {
  depth: UInt;
  children: Array<IPostCategoryWithRelations>;
};
