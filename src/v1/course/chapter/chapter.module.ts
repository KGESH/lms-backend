import { Module } from '@nestjs/common';
import { CourseModule } from '@src/v1/course/course.module';
import { ChapterController } from '@src/v1/course/chapter/chapter.controller';
import { ChapterService } from '@src/v1/course/chapter/chapter.service';
import { ChapterQueryService } from '@src/v1/course/chapter/chapter-query.service';
import { ChapterRepository } from '@src/v1/course/chapter/chapter.repository';

const providers = [ChapterService, ChapterQueryService, ChapterRepository];

@Module({
  imports: [CourseModule],
  controllers: [ChapterController],
  providers: [...providers],
  exports: [...providers],
})
export class ChapterModule {}
