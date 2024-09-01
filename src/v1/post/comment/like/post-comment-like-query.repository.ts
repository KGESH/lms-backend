import { Injectable } from '@nestjs/common';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import { and, eq } from 'drizzle-orm';
import { dbSchema } from '@src/infra/db/schema';
import { IPostCommentLike } from '@src/v1/post/comment/like/post-comment-like.interface';

@Injectable()
export class PostCommentLikeQueryRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async findPostCommentLike(
    where: Pick<IPostCommentLike, 'commentId' | 'userId'>,
  ): Promise<IPostCommentLike | null> {
    const postCommentLike =
      await this.drizzle.db.query.postCommentLikes.findFirst({
        where: and(
          eq(dbSchema.postCommentLikes.commentId, where.commentId),
          eq(dbSchema.postCommentLikes.userId, where.userId),
        ),
      });

    return postCommentLike ?? null;
  }
}
