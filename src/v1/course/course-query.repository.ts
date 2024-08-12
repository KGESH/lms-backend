import { Injectable } from '@nestjs/common';
import { DrizzleService } from '../../infra/db/drizzle.service';
import { and, gte, lte } from 'drizzle-orm';
import { dbSchema } from '../../infra/db/schema';
import * as date from '../../shared/utils/date';

@Injectable()
export class CourseQueryRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async findManyWithTeacher() {
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
