import { UserRole, Uuid } from '@src/shared/types/primitive';
import { Optional } from '@src/shared/types/optional';

export type IPostCategoryAccess = {
  id: Uuid;
  categoryId: Uuid;
  role: UserRole;
};

export type IPostCategoryAccessRoles = Pick<
  IPostCategoryAccess,
  'categoryId'
> & {
  readableRoles: UserRole[];
  writableRoles: UserRole[];
};

export type IPostCategoryAccessCreate = Optional<IPostCategoryAccess, 'id'>;

export type IPostCategoryAccessUpdate = IPostCategoryAccessRoles;

export type IPostCategoryAccessDelete = Pick<IPostCategoryAccess, 'role'>;
