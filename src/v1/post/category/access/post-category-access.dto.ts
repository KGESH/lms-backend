import { UserRole, Uuid } from '@src/shared/types/primitive';

export type PostCategoryAccessDto = {
  id: Uuid;
  categoryId: Uuid;
  role: UserRole;
};

export type CreatePostCategoryAccessDto = {
  readableRoles: UserRole[];
  writableRoles: UserRole[];
};

export type PostCategoryAccessRolesDto = Pick<
  PostCategoryAccessDto,
  'categoryId'
> & {
  readableRoles: UserRole[];
  writableRoles: UserRole[];
};

export type DeletePostCategoryAccessDto = Omit<
  PostCategoryAccessRolesDto,
  'categoryId'
>;
