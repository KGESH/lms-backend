import { Module } from '@nestjs/common';
import { PostLikeService } from '@src/v1/post/like/post-like.service';
import { PostLikeRepository } from '@src/v1/post/like/post-like.repository';
import { PostLikeQueryRepository } from '@src/v1/post/like/post-like-query.repository';
import { PostModule } from '@src/v1/post/post.module';
import { PostLikeController } from '@src/v1/post/like/post-like.controller';

const modules = [PostModule];

const providers = [
  PostLikeService,
  PostLikeRepository,
  PostLikeQueryRepository,
];

@Module({
  imports: [...modules],
  controllers: [PostLikeController],
  providers: [...providers],
  exports: [...modules, ...providers],
})
export class PostLikeModule {}
