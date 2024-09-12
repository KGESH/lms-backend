import { PostCategoryAccessRolesDto } from '@src/v1/post/category/access/post-category-access.dto';
import { PostCategoryDto } from '@src/v1/post/category/post-category.dto';
import { UInt } from '@src/shared/types/primitive';

export type PostCategoryWithAccessDto = PostCategoryDto &
  Pick<PostCategoryAccessRolesDto, 'readableRoles' | 'writableRoles'> & {
    depth: UInt;
    children: Array<PostCategoryWithAccessDto>;
  };
