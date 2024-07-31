import { Module } from '@nestjs/common';
import { LessonContentController } from './lesson-content.controller';
import { LessonContentService } from './lesson-content.service';
import { LessonContentQueryRepository } from './lesson-content-query.repository';
import { LessonContentQueryService } from './lesson-content-query.service';
import { LessonContentRepository } from './lesson-content.repository';

const providers = [
  LessonContentService,
  LessonContentQueryService,
  LessonContentRepository,
  LessonContentQueryRepository,
];

@Module({
  controllers: [LessonContentController],
  providers: [...providers],
  exports: [...providers],
})
export class LessonContentModule {}
