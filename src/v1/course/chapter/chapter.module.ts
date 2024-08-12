import { Module } from '@nestjs/common';
import { ChapterController } from './chapter.controller';
import { ChapterService } from './chapter.service';
import { ChapterQueryRepository } from './chapter-query.repository';
import { ChapterQueryService } from './chapter-query.service';
import { ChapterRepository } from './chapter.repository';
import { CourseModule } from '../course.module';

const providers = [
  ChapterService,
  ChapterQueryService,
  ChapterRepository,
  ChapterQueryRepository,
];

@Module({
  imports: [CourseModule],
  controllers: [ChapterController],
  providers: [...providers],
  exports: [...providers],
})
export class ChapterModule {}
