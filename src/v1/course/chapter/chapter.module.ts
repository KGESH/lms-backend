import { Module } from '@nestjs/common';
import { CourseModule } from '@src/v1/course/course.module';
import { ChapterController } from '@src/v1/course/chapter/chapter.controller';
import { ChapterService } from '@src/v1/course/chapter/chapter.service';
import { ChapterQueryService } from '@src/v1/course/chapter/chapter-query.service';
import { ChapterRepository } from '@src/v1/course/chapter/chapter.repository';
import { ChapterQueryRepository } from '@src/v1/course/chapter/chapter-query.repository';

const modules = [CourseModule];

const providers = [
  ChapterService,
  ChapterQueryService,
  ChapterRepository,
  ChapterQueryRepository,
];

@Module({
  imports: [...modules],
  controllers: [ChapterController],
  providers: [...providers],
  exports: [...modules, ...providers],
})
export class ChapterModule {}
