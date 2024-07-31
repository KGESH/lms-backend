import { Module } from '@nestjs/common';
import { LessonController } from './lesson.controller';
import { LessonService } from './lesson.service';
import { LessonQueryRepository } from './lesson-query.repository';
import { LessonQueryService } from './lesson-query.service';
import { LessonRepository } from './lesson.repository';
import { LessonContentModule } from './lesson-content/lesson-content.module';

const providers = [
  LessonService,
  LessonQueryService,
  LessonRepository,
  LessonQueryRepository,
];

@Module({
  imports: [LessonContentModule],
  controllers: [LessonController],
  providers: [...providers],
  exports: [...providers, LessonContentModule],
})
export class LessonModule {}
