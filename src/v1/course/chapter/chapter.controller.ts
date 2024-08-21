import { Controller, UseGuards } from '@nestjs/common';
import { ChapterService } from './chapter.service';
import {
  TypedBody,
  TypedException,
  TypedHeaders,
  TypedParam,
  TypedRoute,
} from '@nestia/core';
import { ChapterQueryService } from './chapter-query.service';
import { Uuid } from '../../../shared/types/primitive';
import { ChapterDto, ChapterCreateDto, ChapterUpdateDto } from './chapter.dto';
import { TypeGuardError } from 'typia';
import { IErrorResponse } from '../../../shared/types/response';
import { SkipAuth } from '../../../core/decorators/skip-auth.decorator';
import { ApiAuthHeaders, AuthHeaders } from '../../auth/auth.headers';
import { Roles } from '../../../core/decorators/roles.decorator';
import { RolesGuard } from '../../../core/guards/roles.guard';

@Controller('v1/course/:courseId/chapter')
export class ChapterController {
  constructor(
    private readonly chapterService: ChapterService,
    private readonly chapterQueryService: ChapterQueryService,
  ) {}

  @TypedRoute.Get('/')
  @SkipAuth()
  @TypedException<TypeGuardError>({
    status: 400,
    description: 'invalid request',
  })
  async getChapters(
    @TypedHeaders() headers: ApiAuthHeaders,
    @TypedParam('courseId') courseId: Uuid,
  ): Promise<ChapterDto[]> {
    const chapters = await this.chapterQueryService.findChapters({ courseId });
    return chapters;
  }

  @TypedRoute.Get('/:id')
  @SkipAuth()
  @TypedException<TypeGuardError>({
    status: 400,
    description: 'invalid request',
  })
  async getChapter(
    @TypedHeaders() headers: ApiAuthHeaders,
    @TypedParam('courseId') courseId: Uuid,
    @TypedParam('id') id: Uuid,
  ): Promise<ChapterDto | null> {
    const chapter = await this.chapterQueryService.findChapterById({ id });
    return chapter;
  }

  @TypedRoute.Post('/')
  @Roles('admin', 'manager', 'teacher')
  @UseGuards(RolesGuard)
  @TypedException<TypeGuardError>({
    status: 400,
    description: 'invalid request',
  })
  @TypedException<IErrorResponse<404>>({
    status: 404,
    description: 'course not found',
  })
  async createChapter(
    @TypedHeaders() headers: AuthHeaders,
    @TypedParam('courseId') courseId: Uuid,
    @TypedBody() body: ChapterCreateDto,
  ): Promise<ChapterDto> {
    const chapter = await this.chapterService.createChapter({
      ...body,
      courseId,
    });
    return chapter;
  }

  @TypedRoute.Patch('/:id')
  @Roles('admin', 'manager', 'teacher')
  @UseGuards(RolesGuard)
  @TypedException<TypeGuardError>({
    status: 400,
    description: 'invalid request',
  })
  @TypedException<IErrorResponse<404>>({
    status: 404,
    description: 'chapter not found',
  })
  async updateChapter(
    @TypedHeaders() headers: AuthHeaders,
    @TypedParam('courseId') courseId: Uuid,
    @TypedParam('id') id: Uuid,
    @TypedBody() body: ChapterUpdateDto,
  ): Promise<ChapterDto> {
    const chapter = await this.chapterService.updateChapter({ id }, body);
    return chapter;
  }

  @TypedRoute.Delete('/:id')
  @TypedException<TypeGuardError>({
    status: 400,
    description: 'invalid request',
  })
  @TypedException<IErrorResponse<404>>({
    status: 404,
    description: 'chapter not found',
  })
  async deleteChapter(
    @TypedHeaders() headers: AuthHeaders,
    @TypedParam('courseId') courseId: Uuid,
    @TypedParam('id') id: Uuid,
  ): Promise<ChapterDto> {
    const chapter = await this.chapterService.deleteChapter({ id });
    return chapter;
  }
}
