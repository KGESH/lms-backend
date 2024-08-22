import { Module } from '@nestjs/common';
import { LessonModule } from '@src/v1/course/chapter/lesson/lesson.module';
import { LessonContentController } from '@src/v1/course/chapter/lesson/lesson-content/lesson-content.controller';
import { LessonContentService } from '@src/v1/course/chapter/lesson/lesson-content/lesson-content.service';
import { LessonContentQueryService } from '@src/v1/course/chapter/lesson/lesson-content/lesson-content-query.service';
import { LessonContentRepository } from '@src/v1/course/chapter/lesson/lesson-content/lesson-content.repository';
import { LessonContentQueryRepository } from '@src/v1/course/chapter/lesson/lesson-content/lesson-content-query.repository';

const providers = [
  LessonContentService,
  LessonContentQueryService,
  LessonContentRepository,
  LessonContentQueryRepository,
];

@Module({
  imports: [LessonModule],
  controllers: [LessonContentController],
  providers: [...providers],
  exports: [...providers],
})
export class LessonContentModule {}
