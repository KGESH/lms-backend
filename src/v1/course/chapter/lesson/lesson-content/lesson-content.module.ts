import { Module } from '@nestjs/common';
import { LessonContentController } from './lesson-content.controller';
import { LessonContentService } from './lesson-content.service';
import { LessonContentQueryService } from './lesson-content-query.service';
import { LessonContentRepository } from './lesson-content.repository';
import { LessonModule } from '../lesson.module';
import { LessonContentQueryRepository } from './lesson-content-query.repository';

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
