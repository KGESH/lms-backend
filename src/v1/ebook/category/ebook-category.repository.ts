import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import { dbSchema } from '@src/infra/db/schema';
import {
  IEbookCategory,
  IEbookCategoryCreate,
  IEbookCategoryUpdate,
} from '@src/v1/ebook/category/ebook-category.interface';

@Injectable()
export class EbookCategoryRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async createCategory(
    params: IEbookCategoryCreate,
    db = this.drizzle.db,
  ): Promise<IEbookCategory> {
    const [category] = await db
      .insert(dbSchema.ebookCategories)
      .values(params)
      .returning();
    return category;
  }

  async updateCategory(
    where: Pick<IEbookCategory, 'id'>,
    params: IEbookCategoryUpdate,
    db = this.drizzle.db,
  ): Promise<IEbookCategory> {
    const [category] = await db
      .update(dbSchema.ebookCategories)
      .set(params)
      .where(eq(dbSchema.ebookCategories.id, where.id))
      .returning();
    return category;
  }

  async deleteCategory(
    where: Pick<IEbookCategory, 'id'>,
    db = this.drizzle.db,
  ): Promise<IEbookCategory> {
    const [category] = await db
      .delete(dbSchema.ebookCategories)
      .where(eq(dbSchema.ebookCategories.id, where.id))
      .returning();
    return category;
  }
}
