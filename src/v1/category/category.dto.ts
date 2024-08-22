import { Uuid } from '@src/shared/types/primitive';
import { Pagination } from '@src/shared/types/pagination';

export type CategoryDto = {
  id: Uuid;
  parentId: Uuid | null;
  name: string;
  description: string | null;
};

export type CategoryWithChildrenDto = CategoryDto & {
  children: Array<CategoryWithChildrenDto>;
};

export type CreateCategoryDto = Pick<
  CategoryDto,
  'name' | 'parentId' | 'description'
>;

export type UpdateCategoryDto = Omit<Partial<CategoryDto>, 'id'>;

export type CategoryWithChildrenQuery = {
  withChildren?: boolean;
};

export type CategoryQuery = CategoryWithChildrenQuery & Partial<Pagination>;
