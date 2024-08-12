import { Module } from '@nestjs/common';
import { LessonController } from './lesson.controller';
import { LessonService } from './lesson.service';
import { LessonQueryRepository } from './lesson-query.repository';
import { LessonQueryService } from './lesson-query.service';
import { LessonRepository } from './lesson.repository';
import { ChapterModule } from '../chapter.module';

const providers = [
  LessonService,
  LessonQueryService,
  LessonRepository,
  LessonQueryRepository,
];

@Module({
  imports: [ChapterModule],
  controllers: [LessonController],
  providers: [...providers],
  exports: [...providers],
})
export class LessonModule {}
