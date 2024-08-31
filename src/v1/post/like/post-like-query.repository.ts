import { Injectable } from '@nestjs/common';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import { IPostLike } from '@src/v1/post/like/post-like.interface';
import { and, eq } from 'drizzle-orm';
import { dbSchema } from '@src/infra/db/schema';

@Injectable()
export class PostLikeQueryRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async findPostLike(
    where: Pick<IPostLike, 'postId' | 'userId'>,
  ): Promise<IPostLike | null> {
    const postLike = await this.drizzle.db.query.postLikes.findFirst({
      where: and(
        eq(dbSchema.postLikes.postId, where.postId),
        eq(dbSchema.postLikes.userId, where.userId),
      ),
    });

    return postLike ?? null;
  }
}
