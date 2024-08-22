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
import { SkipAuth } from '@src/core/decorators/skip-auth.decorator';
import { ApiAuthHeaders, AuthHeaders } from '@src/v1/auth/auth.headers';
import { Roles } from '@src/core/decorators/roles.decorator';
import { RolesGuard } from '@src/core/guards/roles.guard';

@Controller(
  'v1/course/:courseId/chapter/:chapterId/lesson/:lessonId/lesson-content',
)
export class LessonContentController {
  constructor(
    private readonly lessonContentService: LessonContentService,
    private readonly lessonContentQueryService: LessonContentQueryService,
  ) {}

  @TypedRoute.Get('/')
  @SkipAuth()
  @TypedException<TypeGuardError>({
    status: 400,
    description: 'invalid request',
  })
  async getLessonContents(
    @TypedHeaders() headers: ApiAuthHeaders,
    @TypedParam('courseId') courseId: Uuid,
    @TypedParam('chapterId') chapterId: Uuid,
    @TypedParam('lessonId') lessonId: Uuid,
  ): Promise<LessonContentDto[]> {
    console.log(courseId, lessonId);
    const lessonContents =
      await this.lessonContentQueryService.findLessonContents({ lessonId });
    return lessonContents;
  }

  @TypedRoute.Get('/:id')
  @SkipAuth()
  @TypedException<TypeGuardError>({
    status: 400,
    description: 'invalid request',
  })
  async getLessonContent(
    @TypedHeaders() headers: ApiAuthHeaders,
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

  @TypedRoute.Post('/')
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
  async createLessonContent(
    @TypedHeaders() headers: AuthHeaders,
    @TypedParam('courseId') courseId: Uuid,
    @TypedParam('chapterId') chapterId: Uuid,
    @TypedParam('lessonId') lessonId: Uuid,
    @TypedBody() body: LessonContentCreateDto,
  ): Promise<LessonContentDto> {
    const lessonContent = await this.lessonContentService.createLessonContent({
      ...body,
      lessonId,
    });
    return lessonContent;
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
    description: 'lesson content not found',
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
      { id },
      body,
    );
    return lessonContent;
  }

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
