import { UInt, Uuid } from '@src/shared/types/primitive';
import { Pagination } from '@src/shared/types/pagination';

export type PostCategoryDto = {
  id: Uuid;
  parentId: Uuid | null;
  name: string;
  description: string | null;
};

export type PostCategoryWithChildrenDto = PostCategoryDto & {
  depth: UInt;
  children: Array<PostCategoryWithChildrenDto>;
};

export type CreatePostCategoryDto = Pick<
  PostCategoryDto,
  'name' | 'parentId' | 'description'
>;

export type UpdatePostCategoryDto = Omit<Partial<PostCategoryDto>, 'id'>;

export type PostCategoryWithChildrenQuery = {
  withChildren?: boolean;
};

export type PostCategoryQuery = Partial<
  PostCategoryWithChildrenQuery & Pagination
>;
