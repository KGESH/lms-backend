import { Uuid } from '../../shared/types/primitive';

export type ICategory = {
  id: Uuid;
  parentId: Uuid | null;
  name: string;
  description: string | null;
};

export type ICategoryWithRelations = ICategory & {
  parent: ICategoryWithRelations | null;
  children: Array<ICategoryWithRelations>;
};
