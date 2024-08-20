import { Uuid } from '../../shared/types/primitive';
import { Pagination } from '../../shared/types/pagination';

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

export type CategoryQuery = {
  withChildren: boolean;
} & Partial<Pagination>;
