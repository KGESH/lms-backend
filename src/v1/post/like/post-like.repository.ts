import { Injectable } from '@nestjs/common';
import { DrizzleService } from '@src/infra/db/drizzle.service';
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
}
