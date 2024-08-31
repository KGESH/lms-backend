import { Module } from '@nestjs/common';
import { PostCategoryAccessRepository } from '@src/v1/post/category/access/post-category-access.repository';
import { PostCategoryAccessQueryRepository } from '@src/v1/post/category/access/post-category-access-query.repository';
import { PostCategoryAccessController } from '@src/v1/post/category/access/post-category-access.controller';
import { PostCategoryAccessService } from '@src/v1/post/category/access/post-category-access.service';

const providers = [
  PostCategoryAccessService,
  PostCategoryAccessRepository,
  PostCategoryAccessQueryRepository,
];

@Module({
  imports: [],
  controllers: [PostCategoryAccessController],
  providers: [...providers],
  exports: [...providers],
})
export class PostCategoryAccessModule {}
