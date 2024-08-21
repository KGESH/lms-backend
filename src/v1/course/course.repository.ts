import { Injectable } from '@nestjs/common';
import { DrizzleService } from '../../infra/db/drizzle.service';
import { ICourse, ICourseCreate, ICourseUpdate } from './course.interface';
import { eq } from 'drizzle-orm';
import { dbSchema } from '../../infra/db/schema';
import { Pagination } from '../../shared/types/pagination';

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

  async findOneOrThrow(where: Pick<ICourse, 'id'>): Promise<ICourse> {
    const course = await this.findCourse(where);

    if (!course) {
      throw new Error('Course not found');
    }

    return course;
  }

  async findManyCourses(pagination: Pagination): Promise<ICourse[]> {
    return await this.drizzle.db.query.courses.findMany({
      orderBy: (course, { desc }) => desc(course.createdAt),
      limit: pagination.pageSize,
      offset: (pagination.page - 1) * pagination.pageSize,
    });
  }

  async create(params: ICourseCreate, db = this.drizzle.db): Promise<ICourse> {
    const [course] = await db
      .insert(dbSchema.courses)
      .values(params)
      .returning();
    return course;
  }

  async update(
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

  async delete(
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
