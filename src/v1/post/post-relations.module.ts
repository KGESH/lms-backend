import { Module } from '@nestjs/common';
import { PostModule } from '@src/v1/post/post.module';
import { PostLikeModule } from '@src/v1/post/like/post-like.module';
import { PostRelationsController } from '@src/v1/post/post-relations.controller';
import { PostRelationsService } from '@src/v1/post/post-relations.service';
import { PostCommentModule } from '@src/v1/post/comment/post-comment.module';
import { PostCommentLikeModule } from '@src/v1/post/comment/like/post-comment-like.module';

const modules = [
  PostModule,
  PostLikeModule,
  PostCommentModule,
  PostCommentLikeModule,
];

const providers = [PostRelationsService];

@Module({
  imports: [...modules],
  controllers: [PostRelationsController],
  providers: [...providers],
  exports: [...modules, ...providers],
})
export class PostRelationsModule {}
