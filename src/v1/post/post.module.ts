import { Module } from '@nestjs/common';
import { PostCategoryModule } from '@src/v1/post/category/post-category.module';
import { PostRepository } from '@src/v1/post/post.repository';
import { PostQueryRepository } from '@src/v1/post/post-query.repository';
import { PostSnapshotRepository } from '@src/v1/post/post-snapshot.repository';
import { PostService } from '@src/v1/post/post.service';

const modules = [PostCategoryModule];

const providers = [
  PostService,
  PostRepository,
  PostQueryRepository,
  PostSnapshotRepository,
];

@Module({
  imports: [...modules],
  providers: [...providers],
  exports: [...modules, ...providers],
})
export class PostModule {}
