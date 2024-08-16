import { Controller } from '@nestjs/common';
import { ChapterService } from './chapter.service';
import {
  TypedBody,
  TypedException,
  TypedParam,
  TypedRoute,
} from '@nestia/core';
import { ChapterQueryService } from './chapter-query.service';
import { Uuid } from '../../../shared/types/primitive';
import { ChapterDto, ChapterCreateDto, ChapterUpdateDto } from './chapter.dto';
import { TypeGuardError } from 'typia';
import { IErrorResponse } from '../../../shared/types/response';

@Controller('v1/course/:courseId/chapter')
export class ChapterController {
  constructor(
    private readonly chapterService: ChapterService,
    private readonly chapterQueryService: ChapterQueryService,
  ) {}

  @TypedRoute.Get('/')
  async getChapters(
    @TypedParam('courseId') courseId: Uuid,
  ): Promise<ChapterDto[]> {
    const chapters = await this.chapterQueryService.findChapters();
    return chapters;
  }

  @TypedException<TypeGuardError>({
    status: 400,
    description: 'invalid request',
  })
  @TypedRoute.Get('/:id')
  async getChapter(
    @TypedParam('courseId') courseId: Uuid,
    @TypedParam('id') id: Uuid,
  ): Promise<ChapterDto | null> {
    const chapter = await this.chapterQueryService.findChapterById({ id });
    return chapter;
  }

  @TypedException<TypeGuardError>({
    status: 400,
    description: 'invalid request',
  })
  @TypedException<IErrorResponse<404>>({
    status: 404,
    description: 'course not found',
  })
  @TypedRoute.Post('/')
  async createChapter(
    @TypedParam('courseId') courseId: Uuid,
    @TypedBody() body: ChapterCreateDto,
  ): Promise<ChapterDto> {
    const chapter = await this.chapterService.createChapter({
      ...body,
      courseId,
    });
    return chapter;
  }

  @TypedException<TypeGuardError>({
    status: 400,
    description: 'invalid request',
  })
  @TypedException<IErrorResponse<404>>({
    status: 404,
    description: 'chapter not found',
  })
  @TypedRoute.Patch('/:id')
  async updateChapter(
    @TypedParam('courseId') courseId: Uuid,
    @TypedParam('id') id: Uuid,
    @TypedBody() body: ChapterUpdateDto,
  ): Promise<ChapterDto> {
    const chapter = await this.chapterService.updateChapter({ id }, body);
    return chapter;
  }

  @TypedException<TypeGuardError>({
    status: 400,
    description: 'invalid request',
  })
  @TypedException<IErrorResponse<404>>({
    status: 404,
    description: 'chapter not found',
  })
  @TypedRoute.Delete('/:id')
  async deleteChapter(
    @TypedParam('courseId') courseId: Uuid,
    @TypedParam('id') id: Uuid,
  ): Promise<ChapterDto> {
    const chapter = await this.chapterService.deleteChapter({ id });
    return chapter;
  }
}
