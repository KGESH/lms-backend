import { Injectable } from '@nestjs/common';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import { dbSchema } from '@src/infra/db/schema';
import {
  IPostCommentLike,
  IPostCommentLikeCreate,
} from '@src/v1/post/comment/like/post-comment-like.interface';

@Injectable()
export class PostCommentLikeRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async createPostCommentLike(
    params: IPostCommentLikeCreate,
  ): Promise<IPostCommentLike> {
    const [postCommentLike] = await this.drizzle.db
      .insert(dbSchema.postCommentLikes)
      .values(params)
      .returning();

    return postCommentLike;
  }
}
