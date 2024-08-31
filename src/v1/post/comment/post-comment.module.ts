import { Module } from '@nestjs/common';
import { PostCommentRepository } from '@src/v1/post/comment/post-comment.repository';
import { PostCommentQueryRepository } from '@src/v1/post/comment/post-comment-query.repository';
import { PostCommentService } from '@src/v1/post/comment/post-comment.service';

const modules = [];

const providers = [
  PostCommentService,
  PostCommentRepository,
  PostCommentQueryRepository,
];

@Module({
  imports: [...modules],
  providers: [...providers],
  exports: [...modules, ...providers],
})
export class PostCommentModule {}
