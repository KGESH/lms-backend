import { Module } from '@nestjs/common';
import { PostCommentRepository } from '@src/v1/post/comment/post-comment.repository';
import { PostCommentQueryRepository } from '@src/v1/post/comment/post-comment-query.repository';
import { PostCommentService } from '@src/v1/post/comment/post-comment.service';
import { PostCommentController } from '@src/v1/post/comment/post-comment.controller';
import { PostModule } from '@src/v1/post/post.module';
import { PostCommentSnapshotRepository } from '@src/v1/post/comment/post-comment-snapshot.repository';

const modules = [PostModule];

const providers = [
  PostCommentService,
  PostCommentRepository,
  PostCommentSnapshotRepository,
  PostCommentQueryRepository,
];

@Module({
  imports: [...modules],
  controllers: [PostCommentController],
  providers: [...providers],
  exports: [...modules, ...providers],
})
export class PostCommentModule {}
