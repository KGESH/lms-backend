import { Uuid } from '@src/shared/types/primitive';
import { Optional } from '@src/shared/types/optional';

export type IEbookCategory = {
  id: Uuid;
  parentId: Uuid | null;
  name: string;
  description: string | null;
};

export type IEbookCategoryWithChildren = IEbookCategory & {
  children: Array<IEbookCategoryWithChildren>;
};

export type IEbookCategoryCreate = Optional<IEbookCategory, 'id'>;

export type IEbookCategoryUpdate = Omit<Partial<IEbookCategoryCreate>, 'id'>;

export type IEbookCategoryWithRelations = IEbookCategory & {
  depth: number;
  children: Array<IEbookCategoryWithRelations>;
};
