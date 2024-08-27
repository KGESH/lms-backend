import { Module } from '@nestjs/common';
import { CourseReviewService } from '@src/v1/review/course-review/course-review.service';
import { CourseReviewController } from '@src/v1/review/course-review/course-review.controller';
import { ReviewModule } from '@src/v1/review/review.module';
import { CourseReviewRepository } from '@src/v1/review/course-review/course-review.repository';
import { CourseReviewAdminService } from '@src/v1/review/course-review/course-review-admin.service';

const modules = [ReviewModule];

const providers = [
  CourseReviewService,
  CourseReviewAdminService,
  CourseReviewRepository,
];

@Module({
  imports: [...modules],
  controllers: [CourseReviewController],
  providers: [...providers],
  exports: [...modules, ...providers],
})
export class CourseReviewModule {}
