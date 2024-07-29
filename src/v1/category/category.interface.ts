import { Uuid } from '../../shared/types/primitive';

export type ICategory = {
  id: Uuid;
  parentId: Uuid | null;
  name: string;
  description: string | null;
  // parent: ICategory | null;
  // children: ICategory[];
};

export type ICategoryWithRelations = ICategory & {
  parent: ICategoryWithRelations | null;
  children: ICategoryWithRelations[];
};

// export type IRootCategory = {
//   id: Uuid;
//   parentId: Uuid | null;
//   name: string;
//   description: string | null;
//   parent: ICategory | null;
//   children: ICategoryWithChildren[];
// };
//
// export type ICategoryWithParent = ICategory & {
//   id: Uuid;
//   parentId: Uuid | null;
//   name: string;
//   description: string | null;
//   parent: ICategory | null;
// };
//
// export type ICategoryWithChildren = ICategoryWithParent & {
//   children: ICategoryWithParent[];
// };
