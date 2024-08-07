import { Controller } from '@nestjs/common';
import { ChapterService } from './chapter.service';
import { TypedParam, TypedRoute } from '@nestia/core';
import { ChapterQueryService } from './chapter-query.service';
import { IChapter } from './chapter.interface';
import { Uuid } from '../../shared/types/primitive';

@Controller('v1/chapter')
export class ChapterController {
  constructor(
    private readonly chapterService: ChapterService,
    private readonly chapterQueryService: ChapterQueryService,
  ) {}

  @TypedRoute.Get('/')
  async getChapters(): Promise<IChapter[]> {
    const chapters = await this.chapterQueryService.findChapters();
    return chapters;
  }

  @TypedRoute.Get('/:id')
  async getChapter(@TypedParam('id') id: Uuid): Promise<IChapter | null> {
    const chapter = await this.chapterQueryService.findChapterById({ id });
    return chapter;
  }
}
