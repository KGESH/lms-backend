import { Injectable } from '@nestjs/common';
import * as typia from 'typia';
import { eq } from 'drizzle-orm';
import { dbSchema } from '@src/infra/db/schema';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import { ICourse } from '@src/v1/course/course.interface';
import { ICourseWithRelations } from '@src/v1/course/course-with-relations.interface';

@Injectable()
export class CourseQueryRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async findCourseWithRelations(
    where: Pick<ICourse, 'id'>,
  ): Promise<ICourseWithRelations | null> {
    const course = await this.drizzle.db.query.courses.findFirst({
      where: eq(dbSchema.courses.id, where.id),
      with: {
        teacher: {
          with: {
            account: true,
          },
        },
        category: true,
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

    if (!course?.teacher?.account) {
      return null;
    }

    return typia.assert<ICourseWithRelations>(course);
    // return course;
  }

  // async findManyWithTeacher() {
  //   const now = date.now('iso');
  //   const coursesWithTeacher = await this.drizzle.db.query.courses.findMany({
  //     with: {
  //       teacher: {
  //         with: {
  //           info: true,
  //         },
  //       },
  //       category: {
  //         with: {
  //           children: {
  //             with: {
  //               children: true,
  //             },
  //           },
  //         },
  //       },
  //       chapters: {
  //         with: {
  //           lessons: true,
  //         },
  //       },
  //       pricing: {
  //         with: {
  //           discounts: {
  //             where: and(
  //               gte(dbSchema.courseDiscounts.validFrom, now),
  //               lte(dbSchema.courseDiscounts.validTo, now),
  //             ),
  //           },
  //         },
  //       },
  //     },
  //   });
  //
  //   return coursesWithTeacher;
  // }
}
