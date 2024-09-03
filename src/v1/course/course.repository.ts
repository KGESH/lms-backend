import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { dbSchema } from '@src/infra/db/schema';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import {
  ICourse,
  ICourseCreate,
  ICourseUpdate,
} from '@src/v1/course/course.interface';

@Injectable()
export class CourseRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async createCourse(
    params: ICourseCreate,
    db = this.drizzle.db,
  ): Promise<ICourse> {
    const [course] = await db
      .insert(dbSchema.courses)
      .values(params)
      .returning();
    return course;
  }

  async updateCourse(
    where: Pick<ICourse, 'id'>,
    params: ICourseUpdate,
    db = this.drizzle.db,
  ): Promise<ICourse> {
    const [updated] = await db
      .update(dbSchema.courses)
      .set(params)
      .where(eq(dbSchema.courses.id, where.id))
      .returning();
    return updated;
  }

  async deleteCourse(
    where: Pick<ICourse, 'id'>,
    db = this.drizzle.db,
  ): Promise<ICourse> {
    const [deleted] = await db
      .delete(dbSchema.courses)
      .where(eq(dbSchema.courses.id, where.id))
      .returning();
    return deleted;
  }
}
