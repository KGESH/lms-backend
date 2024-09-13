import { CategoryAccessRole, Uuid } from '@src/shared/types/primitive';

export type PostCategoryAccessDto = {
  id: Uuid;
  categoryId: Uuid;
  role: CategoryAccessRole;
};

export type CreatePostCategoryAccessDto = {
  readableRoles: CategoryAccessRole[];
  writableRoles: CategoryAccessRole[];
};

export type PostCategoryAccessRolesDto = Pick<
  PostCategoryAccessDto,
  'categoryId'
> & {
  readableRoles: CategoryAccessRole[];
  writableRoles: CategoryAccessRole[];
};

export type DeletePostCategoryAccessDto = Omit<
  PostCategoryAccessRolesDto,
  'categoryId'
>;
