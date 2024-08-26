import { Module } from '@nestjs/common';
import { CourseReviewService } from '@src/v1/review/course-review/course-review.service';
import { CourseReviewController } from '@src/v1/review/course-review/course-review.controller';
import { ReviewModule } from '@src/v1/review/review.module';

const modules = [ReviewModule];

const providers = [CourseReviewService];

@Module({
  imports: [...modules],
  controllers: [CourseReviewController],
  providers: [...providers],
  exports: [...modules, ...providers],
})
export class CourseReviewModule {}
