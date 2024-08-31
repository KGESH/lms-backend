import { Injectable } from '@nestjs/common';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import { dbSchema } from '@src/infra/db/schema';
import {
  IPostCategory,
  IPostCategoryCreate,
  IPostCategoryUpdate,
} from '@src/v1/post/category/post-category.interface';
import { eq } from 'drizzle-orm';

@Injectable()
export class PostCategoryRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async createPostCategory(
    params: IPostCategoryCreate,
    db = this.drizzle.db,
  ): Promise<IPostCategory> {
    const [category] = await db
      .insert(dbSchema.postCategories)
      .values(params)
      .returning();
    return category;
  }

  async updatePostCategory(
    where: Pick<IPostCategory, 'id'>,
    params: IPostCategoryUpdate,
    db = this.drizzle.db,
  ): Promise<IPostCategory> {
    const [category] = await db
      .update(dbSchema.postCategories)
      .set(params)
      .where(eq(dbSchema.postCategories.id, where.id))
      .returning();
    return category;
  }

  // Cascade HARD delete
  async deletePostCategory(
    where: Pick<IPostCategory, 'id'>,
    db = this.drizzle.db,
  ): Promise<void> {
    await db
      .delete(dbSchema.postCategories)
      .where(eq(dbSchema.postCategories.id, where.id))
      .execute();
  }
}
