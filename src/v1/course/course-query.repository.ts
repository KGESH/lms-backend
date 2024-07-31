import { Injectable } from '@nestjs/common';
import { DrizzleService } from '../../infra/db/drizzle.service';
import { and, gte, lte } from 'drizzle-orm';
import { dbSchema } from '../../infra/db/schema';
import * as date from '../../shared/utils/date';
// import { ICourse } from './course.interface';
// import { ICategoryWithRelations } from '../category/category.interface';

@Injectable()
export class CourseQueryRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  // ICourse & {
  // teacher: ITeacher;
  // category: ICategoryWithRelations;
  // chapters: IChapter[];
  // }
  // >
  async findManyWithTeacher() {
    // : Promise<
    const now = date.now('iso');
    const coursesWithTeacher = await this.drizzle.db.query.courses.findMany({
      with: {
        teacher: {
          with: {
            info: true,
          },
        },
        category: {
          with: {
            children: {
              with: {
                children: true,
              },
            },
          },
        },
        chapters: {
          with: {
            lessons: true,
          },
        },
        pricing: {
          with: {
            discounts: {
              where: and(
                gte(dbSchema.courseDiscounts.validFrom, now),
                lte(dbSchema.courseDiscounts.validTo, now),
              ),
            },
          },
        },
      },
    });

    return coursesWithTeacher;
  }
}
