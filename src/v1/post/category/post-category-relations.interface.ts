import { IPostCategory } from '@src/v1/post/category/post-category.interface';
import { IPostCategoryAccessRoles } from '@src/v1/post/category/access/post-category-access.interface';
import { UInt } from '@src/shared/types/primitive';

export type IPostCategoryWithRoles = IPostCategory &
  Pick<IPostCategoryAccessRoles, 'readableRoles' | 'writableRoles'>;

export type IPostCategoryRelationsWithRoles = IPostCategory &
  Pick<IPostCategoryAccessRoles, 'readableRoles' | 'writableRoles'> & {
    depth: UInt;
    children: Array<IPostCategoryRelationsWithRoles>;
  };
