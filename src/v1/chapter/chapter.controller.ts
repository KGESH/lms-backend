import { Controller } from '@nestjs/common';
import { ChapterService } from './chapter.service';
import { TypedParam, TypedRoute } from '@nestia/core';
import { ChapterQueryService } from './chapter-query.service';
import { IChapter } from './chapter.interface';
import { IResponse } from '../../shared/types/response';
import { Uuid } from '../../shared/types/primitive';

@Controller('v1/chapter')
export class ChapterController {
  constructor(
    private readonly chapterService: ChapterService,
    private readonly chapterQueryService: ChapterQueryService,
  ) {}

  @TypedRoute.Get('/')
  async getChapters(): Promise<IResponse<IChapter[]>> {
    const chapters = await this.chapterQueryService.findChapters();
    return { data: chapters };
  }

  @TypedRoute.Get('/:id')
  async getChapter(
    @TypedParam('id') id: Uuid,
  ): Promise<IResponse<IChapter | null>> {
    const chapter = await this.chapterQueryService.findChapterById({ id });
    return { data: chapter };
  }
}
