import { Injectable } from '@nestjs/common';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import { count, eq } from 'drizzle-orm';
import {
  IPostLike,
  IPostLikeCreate,
} from '@src/v1/post/like/post-like.interface';
import { dbSchema } from '@src/infra/db/schema';

@Injectable()
export class PostLikeRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async createPostLike(params: IPostLikeCreate): Promise<IPostLike> {
    const [postLike] = await this.drizzle.db
      .insert(dbSchema.postLikes)
      .values(params)
      .returning();

    return postLike;
  }

  async getPostLikeCount(where: Pick<IPostLike, 'postId'>): Promise<number> {
    const [likes] = await this.drizzle.db
      .select({
        count: count(),
      })
      .from(dbSchema.postLikes)
      .where(eq(dbSchema.postLikes.postId, where.postId));

    return likes.count;
  }
}
