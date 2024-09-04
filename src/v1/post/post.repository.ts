import { Injectable } from '@nestjs/common';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import { IPost, IPostCreate } from '@src/v1/post/post.interface';
import { dbSchema } from '@src/infra/db/schema';
import * as date from '@src/shared/utils/date';
import { eq, sql } from 'drizzle-orm';

@Injectable()
export class PostRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async createPost(params: IPostCreate, db = this.drizzle.db): Promise<IPost> {
    const [post] = await db.insert(dbSchema.posts).values(params).returning();
    return post;
  }

  async incrementPostViewCount(
    where: Pick<IPost, 'id'>,
    db = this.drizzle.db,
  ): Promise<IPost> {
    const [post] = await db
      .update(dbSchema.posts)
      .set({ viewCount: sql`${dbSchema.posts.viewCount} + 1` })
      .where(eq(dbSchema.posts.id, where.id))
      .returning();
    return post;
  }

  // Soft delete
  async deletePost(
    where: Pick<IPost, 'id'>,
    db = this.drizzle.db,
  ): Promise<IPost> {
    const [deleted] = await db
      .update(dbSchema.posts)
      .set({ deletedAt: date.now('date') })
      .where(eq(dbSchema.posts.id, where.id))
      .returning();
    return deleted;
  }
}
