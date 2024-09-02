import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { dbSchema } from '@src/infra/db/schema';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import { ICourse } from '@src/v1/course/course.interface';
import { ICourseWithRelations } from '@src/v1/course/course-with-relations.interface';
import { Pagination } from '@src/shared/types/pagination';

@Injectable()
export class CourseQueryRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async findManyCoursesWithRelations(
    where: Partial<Pick<ICourse, 'categoryId'>>,
    pagination: Pagination,
  ): Promise<ICourseWithRelations[]> {
    const courses = await this.drizzle.db.query.courses.findMany({
      where: where.categoryId
        ? eq(dbSchema.courses.categoryId, where.categoryId)
        : undefined,
      with: {
        category: true,
        teacher: {
          with: {
            account: true,
          },
        },
      },
      orderBy: (course, { asc, desc }) =>
        pagination.orderBy === 'desc'
          ? desc(course.createdAt)
          : asc(course.createdAt),
      limit: pagination.pageSize,
      offset: (pagination.page - 1) * pagination.pageSize,
    });

    return courses.map((course) => ({
      ...course,
      chapters: [],
    }));
  }

  async findCourseWithRelations(
    where: Pick<ICourse, 'id'>,
  ): Promise<ICourseWithRelations | null> {
    const course = await this.drizzle.db.query.courses.findFirst({
      where: eq(dbSchema.courses.id, where.id),
      with: {
        category: true,
        teacher: {
          with: {
            account: true,
          },
        },
        chapters: {
          with: {
            lessons: {
              with: {
                lessonContents: true,
              },
            },
          },
        },
      },
    });

    if (!course) {
      return null;
    }

    return course;
  }
}
