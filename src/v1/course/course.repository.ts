import { Injectable, NotFoundException } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { dbSchema } from '@src/infra/db/schema';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import {
  ICourse,
  ICourseCreate,
  ICourseUpdate,
} from '@src/v1/course/course.interface';
import { Pagination } from '@src/shared/types/pagination';

@Injectable()
export class CourseRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async findCourse(where: Pick<ICourse, 'id'>): Promise<ICourse | null> {
    const course = await this.drizzle.db.query.courses.findFirst({
      where: eq(dbSchema.courses.id, where.id),
    });

    if (!course) {
      return null;
    }

    return course;
  }

  async findCourseOrThrow(where: Pick<ICourse, 'id'>): Promise<ICourse> {
    const course = await this.findCourse(where);

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    return course;
  }

  async findManyCourses(
    params: Pagination & Partial<Pick<ICourse, 'categoryId'>>,
  ): Promise<ICourse[]> {
    const { categoryId, ...pagination } = params;
    return await this.drizzle.db.query.courses.findMany({
      where: categoryId
        ? eq(dbSchema.courses.categoryId, categoryId)
        : undefined,
      orderBy: (course, { asc, desc }) =>
        pagination.orderBy === 'desc'
          ? desc(course.createdAt)
          : asc(course.createdAt),
      limit: pagination.pageSize,
      offset: (pagination.page - 1) * pagination.pageSize,
    });
  }

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
