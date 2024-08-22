import { Controller, UseGuards } from '@nestjs/common';
import {
  TypedBody,
  TypedException,
  TypedHeaders,
  TypedParam,
  TypedRoute,
} from '@nestia/core';
import { TypeGuardError } from 'typia';
import { LessonService } from '@src/v1/course/chapter/lesson/lesson.service';
import { LessonQueryService } from '@src/v1/course/chapter/lesson/lesson-query.service';
import { Uuid } from '@src/shared/types/primitive';
import {
  LessonCreateDto,
  LessonDto,
  LessonUpdateDto,
} from '@src/v1/course/chapter/lesson/lesson.dto';
import { IErrorResponse } from '@src/shared/types/response';
import { SkipAuth } from '@src/core/decorators/skip-auth.decorator';
import { ApiAuthHeaders, AuthHeaders } from '@src/v1/auth/auth.headers';
import { RolesGuard } from '@src/core/guards/roles.guard';
import { Roles } from '@src/core/decorators/roles.decorator';

@Controller('v1/course/:courseId/chapter/:chapterId/lesson')
export class LessonController {
  constructor(
    private readonly lessonService: LessonService,
    private readonly lessonQueryService: LessonQueryService,
  ) {}

  /**
   * 레슨 목록을 조회합니다.
   *
   * 로그인 없이 조회할 수 있습니다.
   *
   * 레슨 제목, 설명, 표기 순서 정보를 제공합니다.
   *
   * @tag lesson
   * @summary 레슨 목록 조회 (public)
   * @param courseId - 조회할 레슨이 속한 강의의 id
   * @param chapterId - 조회할 레슨이 속한 챕터의 id
   */
  @TypedRoute.Get('/')
  @SkipAuth()
  @TypedException<TypeGuardError>({
    status: 400,
    description: 'invalid request',
  })
  async getLessons(
    @TypedHeaders() headers: ApiAuthHeaders,
    @TypedParam('courseId') courseId: Uuid,
    @TypedParam('chapterId') chapterId: Uuid,
  ): Promise<LessonDto[]> {
    const lessons = await this.lessonQueryService.findLessonsByChapterId({
      chapterId,
    });
    return lessons;
  }

  /**
   * 특정 레슨을 조회합니다.
   *
   * 로그인 없이 조회할 수 있습니다.
   *
   * 레슨 제목, 설명, 표기 순서 정보를 제공합니다.
   *
   * @tag lesson
   * @summary 특정 레슨 조회 (public)
   * @param courseId - 조회할 레슨이 속한 강의의 id
   * @param chapterId - 조회할 레슨이 속한 챕터의 id
   * @param id - 조회할 레슨의 id
   */
  @TypedRoute.Get('/:id')
  @SkipAuth()
  @TypedException<TypeGuardError>({
    status: 400,
    description: 'invalid request',
  })
  async getLesson(
    @TypedHeaders() headers: ApiAuthHeaders,
    @TypedParam('courseId') courseId: Uuid,
    @TypedParam('chapterId') chapterId: Uuid,
    @TypedParam('id') lessonId: Uuid,
  ): Promise<LessonDto | null> {
    const lesson = await this.lessonQueryService.findLessonById({
      id: lessonId,
    });
    return lesson;
  }

  /**
   * 레슨을 생성합니다.
   *
   * 관리자 세션 id를 헤더에 담아서 요청합니다.
   *
   * 레슨 생성 이후 'lesson content'를 생성해야 합니다.
   *
   * @tag lesson
   * @summary 레슨 생성 - Role('admin', 'manager', 'teacher')
   * @param courseId - 생성할 레슨이 속한 강의의 id
   * @param chapterId - 생성할 레슨이 속한 챕터의 id
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
    description: 'chapter not found',
  })
  async createLesson(
    @TypedHeaders() headers: AuthHeaders,
    @TypedParam('courseId') courseId: Uuid,
    @TypedParam('chapterId') chapterId: Uuid,
    @TypedBody() body: LessonCreateDto,
  ): Promise<LessonDto> {
    const lesson = await this.lessonService.createLesson({
      ...body,
      chapterId,
    });
    return lesson;
  }

  /**
   * 레슨을 수정합니다.
   *
   * 관리자 세션 id를 헤더에 담아서 요청합니다.
   *
   * @tag lesson
   * @summary 레슨 수정 - Role('admin', 'manager', 'teacher')
   * @param courseId - 수정할 레슨이 속한 강의의 id
   * @param chapterId - 수정할 레슨이 속한 챕터의 id
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
    description: 'lesson not found',
  })
  async updateLesson(
    @TypedHeaders() headers: AuthHeaders,
    @TypedParam('courseId') courseId: Uuid,
    @TypedParam('chapterId') chapterId: Uuid,
    @TypedParam('id') id: Uuid,
    @TypedBody() body: LessonUpdateDto,
  ): Promise<LessonDto> {
    const lesson = await this.lessonService.updateLesson(
      { id },
      {
        ...body,
        chapterId,
      },
    );
    return lesson;
  }

  /**
   * 레슨을 삭제합니다.
   *
   * 관리자 세션 id를 헤더에 담아서 요청합니다.
   *
   * Hard delete로 구현되어 있습니다.
   *
   * 레슨을 삭제하면 레슨에 속한 모든 'lesson content'도 함께 삭제됩니다.
   *
   * @tag lesson
   * @summary 레슨 삭제 - Role('admin', 'manager', 'teacher')
   * @param courseId - 삭제할 레슨이 속한 강의의 id
   * @param chapterId - 삭제할 레슨이 속한 챕터의 id
   * @param id - 삭제할 챕터의 id
   */
  @TypedRoute.Delete('/:id')
  @Roles('admin', 'manager', 'teacher')
  @UseGuards(RolesGuard)
  @TypedException<TypeGuardError>({
    status: 400,
    description: 'invalid request',
  })
  @TypedException<IErrorResponse<404>>({
    status: 404,
    description: 'lesson not found',
  })
  async deleteLesson(
    @TypedHeaders() headers: AuthHeaders,
    @TypedParam('courseId') courseId: Uuid,
    @TypedParam('chapterId') chapterId: Uuid,
    @TypedParam('id') id: Uuid,
  ): Promise<LessonDto> {
    const lesson = await this.lessonService.deleteLesson({ id });
    return lesson;
  }
}
