import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import { dbSchema } from '@src/infra/db/schema';
import {
  ICourseCategory,
  ICourseCategoryCreate,
  ICourseCategoryUpdate,
} from '@src/v1/course/category/course-category.interface';

@Injectable()
export class CourseCategoryRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async createCourseCategory(
    params: ICourseCategoryCreate,
    db = this.drizzle.db,
  ): Promise<ICourseCategory> {
    const [category] = await db
      .insert(dbSchema.courseCategories)
      .values(params)
      .returning();
    return category;
  }

  async updateCourseCategory(
    where: Pick<ICourseCategory, 'id'>,
    params: ICourseCategoryUpdate,
    db = this.drizzle.db,
  ): Promise<ICourseCategory> {
    const [category] = await db
      .update(dbSchema.courseCategories)
      .set(params)
      .where(eq(dbSchema.courseCategories.id, where.id))
      .returning();
    return category;
  }

  async deleteCourseCategory(
    where: Pick<ICourseCategory, 'id'>,
    db = this.drizzle.db,
  ): Promise<ICourseCategory> {
    const [category] = await db
      .delete(dbSchema.courseCategories)
      .where(eq(dbSchema.courseCategories.id, where.id))
      .returning();
    return category;
  }
}
