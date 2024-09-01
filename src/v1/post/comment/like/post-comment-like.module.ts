import { Module } from '@nestjs/common';
import { PostCommentLikeController } from '@src/v1/post/comment/like/post-comment-like.controller';
import { PostCommentLikeService } from '@src/v1/post/comment/like/post-comment-like.service';
import { PostCommentLikeRepository } from '@src/v1/post/comment/like/post-comment-like.repository';
import { PostCommentLikeQueryRepository } from '@src/v1/post/comment/like/post-comment-like-query.repository';
import { PostCommentModule } from '@src/v1/post/comment/post-comment.module';

const modules = [PostCommentModule];

const providers = [
  PostCommentLikeService,
  PostCommentLikeRepository,
  PostCommentLikeQueryRepository,
];

@Module({
  imports: [...modules],
  controllers: [PostCommentLikeController],
  providers: [...providers],
  exports: [...modules, ...providers],
})
export class PostCommentLikeModule {}
