import { UInt, Uuid } from "@src/shared/types/primitive";
import { Optional } from '@src/shared/types/optional';

export type ICourseCategory = {
  id: Uuid;
  parentId: Uuid | null;
  name: string;
  description: string | null;
};

export type ICourseCategoryWithChildren = ICourseCategory & {
  children: Array<ICourseCategoryWithChildren>;
};

export type ICourseCategoryCreate = Optional<ICourseCategory, 'id'>;

export type ICourseCategoryUpdate = Omit<Partial<ICourseCategoryCreate>, 'id'>;

export type ICourseCategoryWithRelations = ICourseCategory & {
  depth: UInt;
  children: Array<ICourseCategoryWithRelations>;
};
