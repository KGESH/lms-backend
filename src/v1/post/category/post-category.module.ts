import { Module } from '@nestjs/common';
import { PostCategoryService } from '@src/v1/post/category/post-category.service';
import { PostCategoryRepository } from '@src/v1/post/category/post-category.repository';
import { PostCategoryQueryRepository } from '@src/v1/post/category/post-category-query.repository';
import { PostCategoryController } from '@src/v1/post/category/post-category.controller';
import { PostCategoryAccessModule } from '@src/v1/post/category/access/post-category-access.module';

const modules = [PostCategoryAccessModule];

const providers = [
  PostCategoryService,
  PostCategoryRepository,
  PostCategoryQueryRepository,
];

@Module({
  imports: [...modules],
  controllers: [PostCategoryController],
  providers: [...providers],
  exports: [...modules, ...providers],
})
export class PostCategoryModule {}
