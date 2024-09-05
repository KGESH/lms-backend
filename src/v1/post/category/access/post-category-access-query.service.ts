import { Injectable } from '@nestjs/common';
import { PostCategoryAccessQueryRepository } from '@src/v1/post/category/access/post-category-access-query.repository';
import {
  IPostCategoryAccess,
  IPostCategoryAccessRoles,
} from '@src/v1/post/category/access/post-category-access.interface';

@Injectable()
export class PostCategoryAccessQueryService {
  constructor(
    private readonly postCategoryAccessQueryRepository: PostCategoryAccessQueryRepository,
  ) {}

  async findPostCategoryAccesses(
    where: Pick<IPostCategoryAccess, 'categoryId'>,
  ): Promise<IPostCategoryAccessRoles> {
    return await this.postCategoryAccessQueryRepository.findPostCategoryAccesses(
      where,
    );
  }
}
