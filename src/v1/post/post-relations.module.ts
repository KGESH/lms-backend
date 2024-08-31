import { Module } from '@nestjs/common';
import { PostModule } from '@src/v1/post/post.module';
import { PostLikeModule } from '@src/v1/post/like/post-like.module';
import { PostRelationsController } from '@src/v1/post/post-relations.controller';
import { PostRelationsService } from '@src/v1/post/post-relations.service';
import { PostCommentModule } from '@src/v1/post/comment/post-comment.module';

const modules = [PostModule, PostLikeModule, PostCommentModule];

const providers = [PostRelationsService];

@Module({
  imports: [...modules],
  controllers: [PostRelationsController],
  providers: [...providers],
  exports: [...modules, ...providers],
})
export class PostRelationsModule {}
