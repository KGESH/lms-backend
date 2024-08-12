import { Controller } from '@nestjs/common';
import { LessonContentService } from './lesson-content.service';
import {
  TypedBody,
  TypedException,
  TypedParam,
  TypedRoute,
} from '@nestia/core';
import { LessonContentQueryService } from './lesson-content-query.service';
import { Uuid } from '../../../../../shared/types/primitive';
import {
  LessonContentCreateDto,
  LessonContentDto,
  LessonContentUpdateDto,
} from './lesson-content.dto';
import { TypeGuardError } from 'typia';
import { IErrorResponse } from '../../../../../shared/types/response';

@Controller(
  'v1/course/:courseId/chapter/:chapterId/lesson/:lessonId/lesson-content',
)
export class LessonContentController {
  constructor(
    private readonly lessonContentService: LessonContentService,
    private readonly lessonContentQueryService: LessonContentQueryService,
  ) {}

  @TypedRoute.Get('/')
  async getLessonContents(
    @TypedParam('courseId') courseId: Uuid,
    @TypedParam('chapterId') chapterId: Uuid,
    @TypedParam('lessonId') lessonId: Uuid,
  ): Promise<LessonContentDto[]> {
    console.log(courseId, lessonId);
    const lessonContents = await this.lessonContentQueryService.findLessons();
    return lessonContents;
  }

  @TypedException<TypeGuardError>(400, 'invalid request')
  @TypedRoute.Get('/:id')
  async getLessonContent(
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

  @TypedException<TypeGuardError>(400, 'invalid request')
  @TypedException<IErrorResponse<404>>(404, 'lesson content not found')
  @TypedRoute.Post('/')
  async createLessonContent(
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

  @TypedException<TypeGuardError>(400, 'invalid request')
  @TypedException<IErrorResponse<404>>(404, 'lesson content not found')
  @TypedRoute.Patch('/:id')
  async updateLessonContent(
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

  @TypedException<TypeGuardError>(400, 'invalid request')
  @TypedException<IErrorResponse<404>>(404, 'lesson content not found')
  @TypedRoute.Delete('/:id')
  async deleteLessonContent(
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
