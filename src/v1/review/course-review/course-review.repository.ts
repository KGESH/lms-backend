import { Injectable } from '@nestjs/common';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import {
  ICourseReview,
  ICourseReviewCreate,
} from '@src/v1/review/course-review/course-review.interface';
import { dbSchema } from '@src/infra/db/schema';
import * as typia from 'typia';

@Injectable()
export class CourseReviewRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async createCourseReview(
    params: ICourseReviewCreate,
    db = this.drizzle.db,
  ): Promise<ICourseReview> {
    const [courseReview] = await db
      .insert(dbSchema.courseReviews)
      .values(typia.misc.clone(params))
      .returning();

    return courseReview;
  }
}
