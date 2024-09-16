import { Module } from '@nestjs/common';
import { CourseReviewService } from '@src/v1/review/course-review/course-review.service';
import { CourseReviewController } from '@src/v1/review/course-review/course-review.controller';
import { ReviewModule } from '@src/v1/review/review.module';
import { CourseReviewRepository } from '@src/v1/review/course-review/course-review.repository';
import { MockCourseReviewQueryRepository } from '@src/v1/review/mock-review/mock-course-review-query.repository';
import { CourseReviewAdminController } from '@src/v1/review/admin/course/course-review-admin.controller';
import { CourseReviewAdminService } from '@src/v1/review/admin/course/course-review-admin.service';
import { MockReviewRepository } from '@src/v1/review/mock-review/mock-review.repository';

const modules = [ReviewModule];

const providers = [
  CourseReviewService,
  CourseReviewAdminService,
  CourseReviewRepository,
  MockReviewRepository,
  MockCourseReviewQueryRepository,
];

@Module({
  imports: [...modules],
  controllers: [CourseReviewController, CourseReviewAdminController],
  providers: [...providers],
  exports: [...modules, ...providers],
})
export class CourseReviewModule {}
