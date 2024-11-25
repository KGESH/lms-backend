import { Module } from '@nestjs/common';
import { ChapterModule } from '@src/v1/course/chapter/chapter.module';
import { LessonController } from '@src/v1/course/chapter/lesson/lesson.controller';
import { LessonService } from '@src/v1/course/chapter/lesson/lesson.service';
import { LessonQueryRepository } from '@src/v1/course/chapter/lesson/lesson-query.repository';
import { LessonQueryService } from '@src/v1/course/chapter/lesson/lesson-query.service';
import { LessonRepository } from '@src/v1/course/chapter/lesson/lesson.repository';

const modules = [ChapterModule];

const providers = [
  LessonService,
  LessonQueryService,
  LessonRepository,
  LessonQueryRepository,
];

@Module({
  imports: [...modules],
  controllers: [LessonController],
  providers: [...providers],
  exports: [...modules, ...providers],
})
export class LessonModule {}
