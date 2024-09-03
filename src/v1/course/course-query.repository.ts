import { Injectable } from '@nestjs/common';
import { asc, desc, eq, sql } from 'drizzle-orm';
import { dbSchema } from '@src/infra/db/schema';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import { ICourse } from '@src/v1/course/course.interface';
import { ICourseWithRelations } from '@src/v1/course/course-with-relations.interface';
import { Paginated, Pagination } from '@src/shared/types/pagination';
import { OptionalPick } from '@src/shared/types/optional';
import typia from 'typia';

@Injectable()
export class CourseQueryRepository {
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

  async findManyCoursesWithRelations(
    where: OptionalPick<ICourse, 'categoryId'>,
    pagination: Pagination,
  ): Promise<Paginated<ICourseWithRelations[]>> {
    const courses = await this.drizzle.db
      .select({
        id: dbSchema.courses.id,
        teacherId: dbSchema.courses.teacherId,
        categoryId: dbSchema.courses.categoryId,
        title: dbSchema.courses.title,
        description: dbSchema.courses.description,
        createdAt: dbSchema.courses.createdAt,
        updatedAt: dbSchema.courses.updatedAt,
        teacher: dbSchema.teachers,
        teacherUser: dbSchema.users,
        category: dbSchema.courseCategories,
        totalCount: sql<number>`count(*) over()`.mapWith(Number),
      })
      .from(dbSchema.courses)
      .where(
        where.categoryId
          ? eq(dbSchema.courses.categoryId, where.categoryId)
          : undefined,
      )
      .innerJoin(
        dbSchema.teachers,
        eq(dbSchema.teachers.id, dbSchema.courses.teacherId),
      )
      .innerJoin(
        dbSchema.users,
        eq(dbSchema.users.id, dbSchema.teachers.userId),
      )
      .innerJoin(
        dbSchema.courseCategories,
        eq(dbSchema.courseCategories.id, dbSchema.courses.categoryId),
      )
      .orderBy(
        pagination.orderBy === 'asc'
          ? asc(dbSchema.courses.createdAt)
          : desc(dbSchema.courses.createdAt),
      )
      .offset((pagination.page - 1) * pagination.pageSize)
      .limit(pagination.pageSize);

    return {
      pagination,
      totalCount: courses[0]?.totalCount ?? 0,
      data: typia.misc.clone<ICourseWithRelations[]>(
        courses.map((course) => ({
          ...course,
          teacher: {
            id: course.teacherId,
            userId: course.teacherUser.id,
            account: course.teacherUser,
          },
          chapters: [],
        })),
      ),
    };
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
