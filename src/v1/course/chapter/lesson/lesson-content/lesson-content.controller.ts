import { Controller, UseGuards } from '@nestjs/common';
import { LessonContentService } from '@src/v1/course/chapter/lesson/lesson-content/lesson-content.service';
import {
  TypedBody,
  TypedException,
  TypedHeaders,
  TypedParam,
  TypedRoute,
} from '@nestia/core';
import { LessonContentQueryService } from '@src/v1/course/chapter/lesson/lesson-content/lesson-content-query.service';
import { Uuid } from '@src/shared/types/primitive';
import {
  LessonContentCreateDto,
  LessonContentDto,
  LessonContentUpdateDto,
} from '@src/v1/course/chapter/lesson/lesson-content/lesson-content.dto';
import { TypeGuardError } from 'typia';
import { IErrorResponse } from '@src/shared/types/response';
import { AuthHeaders } from '@src/v1/auth/auth.headers';
import { Roles } from '@src/core/decorators/roles.decorator';
import { RolesGuard } from '@src/core/guards/roles.guard';
import { CourseAccessGuard } from '@src/core/guards/course-access.guard';

@Controller(
  'v1/course/:courseId/chapter/:chapterId/lesson/:lessonId/lesson-content',
)
export class LessonContentController {
  constructor(
    private readonly lessonContentService: LessonContentService,
    private readonly lessonContentQueryService: LessonContentQueryService,
  ) {}

  /**
   * 레슨 컨텐츠 목록을 조회합니다.
   *
   * 세션 사용자 role이 'user'라면 해당 'course'를 구매한 사용자만 조회할 수 있습니다.
   *
   * 제목, 설명, 컨텐츠 타입, 컨텐츠 URL, 메타데이터, 표기 순서 정보를 제공합니다.
   *
   * @tag lesson-content
   * @summary 레슨 컨텐츠 목록 조회
   * @param courseId - 조회할 레슨 컨텐츠가 속한 강의의 id
   * @param chapterId - 조회할 레슨 컨텐츠가 속한 챕터의 id
   * @param lessonId - 조회할 레슨 컨텐츠가 속한 레슨의 id
   */
  @TypedRoute.Get('/')
  @UseGuards(CourseAccessGuard)
  @TypedException<TypeGuardError>({
    status: 400,
    description: 'invalid request',
  })
  @TypedException<IErrorResponse<403>>({
    status: 403,
    description: 'User is not enrolled in the course',
  })
  async getLessonContents(
    @TypedHeaders() headers: AuthHeaders,
    @TypedParam('courseId') courseId: Uuid,
    @TypedParam('chapterId') chapterId: Uuid,
    @TypedParam('lessonId') lessonId: Uuid,
  ): Promise<LessonContentDto[]> {
    const lessonContents =
      await this.lessonContentQueryService.findLessonContents({ lessonId });
    return lessonContents;
  }

  /**
   * 특정 레슨 컨텐츠를 조회합니다.
   *
   * 세션 사용자 role이 'user'라면 해당 'course'를 구매한 사용자만 조회할 수 있습니다.
   *
   * 제목, 설명, 컨텐츠 타입, 컨텐츠 URL, 메타데이터, 표기 순서 정보를 제공합니다.
   *
   * @tag lesson-content
   * @summary 특정 레슨 컨텐츠 조회
   * @param courseId - 조회할 레슨 컨텐츠가 속한 강의의 id
   * @param chapterId - 조회할 레슨 컨텐츠가 속한 챕터의 id
   * @param lessonId - 조회할 레슨 컨텐츠가 속한 레슨의 id
   * @param id - 조회할 레슨 컨텐츠의 id
   */
  @TypedRoute.Get('/:id')
  @UseGuards(CourseAccessGuard)
  @TypedException<TypeGuardError>({
    status: 400,
    description: 'invalid request',
  })
  @TypedException<IErrorResponse<403>>({
    status: 403,
    description: 'User is not enrolled in the course',
  })
  async getLessonContent(
    @TypedHeaders() headers: AuthHeaders,
    @TypedParam('courseId') courseId: Uuid,
    @TypedParam('chapterId') chapterId: Uuid,
    @TypedParam('lessonId') lessonId: Uuid,
    @TypedParam('id') lessonContentId: Uuid,
  ): Promise<LessonContentDto | null> {
    const lessonContent =
      await this.lessonContentQueryService.findLessonContentById({
        id: lessonContentId,
      });
    return lessonContent;
  }

  /**
   * 레슨 컨텐츠를 생성합니다.
   *
   * 관리자 세션 id를 헤더에 담아서 요청합니다.
   *
   * @tag lesson-content
   * @summary 레슨 생성 - Role('admin', 'manager', 'teacher')
   * @param courseId - 생성할 레슨 컨텐츠가 속한 강의의 id
   * @param chapterId - 생성할 레슨 컨텐츠가 속한 챕터의 id
   * @param lessonId - 생성할 레슨 컨텐츠가 속한 레슨의 id
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
    description: 'lesson not found',
  })
  async createLessonContents(
    @TypedHeaders() headers: AuthHeaders,
    @TypedParam('courseId') courseId: Uuid,
    @TypedParam('chapterId') chapterId: Uuid,
    @TypedParam('lessonId') lessonId: Uuid,
    @TypedBody() body: LessonContentCreateDto[],
  ): Promise<LessonContentDto[]> {
    const lessonContent = await this.lessonContentService.createLessonContents(
      lessonId,
      body.map((params) => ({ ...params, lessonId })),
    );

    return lessonContent;
  }

  /**
   * 레슨 컨텐츠를 수정합니다.
   *
   * 관리자 세션 id를 헤더에 담아서 요청합니다.
   *
   * @tag lesson-content
   * @summary 레슨 컨텐츠 수정 - Role('admin', 'manager', 'teacher')
   * @param courseId - 수정할 레슨 컨텐츠가 속한 강의의 id
   * @param chapterId - 수정할 레슨 컨텐츠가 속한 챕터의 id
   * @param lessonId - 수정할 레슨 컨텐츠가 속한 레슨의 id
   * @param id - 수정할 레슨 컨텐츠의 id
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
    description: 'lesson content not found',
  })
  @TypedException<IErrorResponse<404>>({
    status: 409,
    description: 'Duplicate sequence [contentType, sequence]',
  })
  async updateLessonContent(
    @TypedHeaders() headers: AuthHeaders,
    @TypedParam('courseId') courseId: Uuid,
    @TypedParam('chapterId') chapterId: Uuid,
    @TypedParam('lessonId') lessonId: Uuid,
    @TypedParam('id') id: Uuid,
    @TypedBody() body: LessonContentUpdateDto,
  ): Promise<LessonContentDto> {
    const lessonContent = await this.lessonContentService.updateLessonContent(
      { id, lessonId },
      body,
    );
    return lessonContent;
  }

  /**
   * 레슨 컨텐츠를 삭제합니다.
   *
   * 관리자 세션 id를 헤더에 담아서 요청합니다.
   *
   * Hard delete로 구현되어 있습니다.
   *
   * @tag lesson-content
   * @summary 레슨 컨텐츠 삭제 - Role('admin', 'manager', 'teacher')
   * @param courseId - 삭제할 레슨 컨텐츠가 속한 강의의 id
   * @param chapterId - 삭제할 레슨 컨텐츠가 속한 챕터의 id
   * @param lessonId - 삭제할 레슨 컨텐츠가 속한 레슨의 id
   * @param id - 삭제할 레슨 컨텐츠의 id
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
    description: 'lesson content not found',
  })
  async deleteLessonContent(
    @TypedHeaders() headers: AuthHeaders,
    @TypedParam('courseId') courseId: Uuid,
    @TypedParam('chapterId') chapterId: Uuid,
    @TypedParam('lessonId') lessonId: Uuid,
    @TypedParam('id') id: Uuid,
  ): Promise<LessonContentDto> {
    const lessonContent = await this.lessonContentService.deleteLessonContent({
      id,
    });
    return lessonContent;
  }
}
