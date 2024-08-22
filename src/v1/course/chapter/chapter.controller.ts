import { Controller, UseGuards } from '@nestjs/common';
import { ChapterService } from './chapter.service';
import { TypeGuardError } from 'typia';
import {
  TypedBody,
  TypedException,
  TypedHeaders,
  TypedParam,
  TypedRoute,
} from '@nestia/core';
import { ChapterQueryService } from '@src/v1/course/chapter/chapter-query.service';
import { Uuid } from '@src/shared/types/primitive';
import {
  ChapterDto,
  ChapterCreateDto,
  ChapterUpdateDto,
} from '@src/v1/course/chapter/chapter.dto';
import { IErrorResponse } from '@src/shared/types/response';
import { SkipAuth } from '@src/core/decorators/skip-auth.decorator';
import { ApiAuthHeaders, AuthHeaders } from '@src/v1/auth/auth.headers';
import { Roles } from '@src/core/decorators/roles.decorator';
import { RolesGuard } from '@src/core/guards/roles.guard';

@Controller('v1/course/:courseId/chapter')
export class ChapterController {
  constructor(
    private readonly chapterService: ChapterService,
    private readonly chapterQueryService: ChapterQueryService,
  ) {}

  /**
   * 챕터 목록을 조회합니다.
   *
   * 로그인 없이 조회할 수 있습니다.
   *
   * 챕터 제목, 설명, 표기 순서 정보를 제공합니다.
   *
   * @tag chapter
   * @summary 챕터 목록 조회 (public)
   * @param courseId - 조회할 챕터가 속한 강의의 id
   */
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

  /**
   * 특정 챕터를 조회합니다.
   *
   * 로그인 없이 조회할 수 있습니다.
   *
   * 챕터 제목, 설명, 표기 순서 정보를 제공합니다.
   *
   * @tag chapter
   * @summary 특정 챕터 조회 (public)
   * @param courseId - 조회할 챕터가 속한 강의의 id
   * @param id - 조회할 챕터의 id
   */
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

  /**
   * 강의 챕터를 생성합니다.
   *
   * 관리자 세션 id를 헤더에 담아서 요청합니다.
   *
   * 강의 챕터 생성 이후 'lesson', 'lesson content' 순서로 생성해야 합니다.
   *
   * @tag chapter
   * @summary 챕터 생성 - Role('admin', 'manager', 'teacher')
   * @param courseId - 생성할 챕터가 속한 강의의 id
   */
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

  /**
   * 강의 챕터를 수정합니다.
   *
   * 관리자 세션 id를 헤더에 담아서 요청합니다.
   *
   * @tag chapter
   * @summary 챕터 수정 - Role('admin', 'manager', 'teacher')
   * @param courseId - 수정할 챕터가 속한 강의의 id
   * @param id - 수정할 챕터의 id
   */
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

  /**
   * 강의 챕터를 삭제합니다.
   *
   * 관리자 세션 id를 헤더에 담아서 요청합니다.
   *
   * Hard delete로 구현되어 있습니다.
   *
   * 챕터를 삭제하면 챕터에 속한 모든 'lesson'과 'lesson content'도 함께 삭제됩니다.
   *
   * @tag chapter
   * @summary 챕터 삭제 - Role('admin', 'manager', 'teacher')
   * @param courseId - 삭제할 챕터가 속한 강의의 id
   * @param id - 삭제할 챕터의 id
   */
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
