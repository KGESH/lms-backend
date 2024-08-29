import { Uuid, UInt } from '@src/shared/types/primitive';
import { Pagination } from '@src/shared/types/pagination';

export type CourseCategoryDto = {
  id: Uuid;
  parentId: Uuid | null;
  name: string;
  description: string | null;
};

export type CourseCategoryWithChildrenDto = CourseCategoryDto & {
  depth: UInt;
  children: Array<CourseCategoryWithChildrenDto>;
};

export type CreateCourseCategoryDto = Pick<
  CourseCategoryDto,
  'name' | 'parentId' | 'description'
>;

export type UpdateCourseCategoryDto = Omit<Partial<CourseCategoryDto>, 'id'>;

export type CourseCategoryWithChildrenQuery = {
  withChildren?: boolean;
};

export type CourseCategoryQuery = Partial<
  CourseCategoryWithChildrenQuery & Pagination
>;
