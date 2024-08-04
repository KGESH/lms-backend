import { Controller } from '@nestjs/common';
import { LessonContentService } from './lesson-content.service';
import { TypedParam, TypedRoute } from '@nestia/core';
import { LessonContentQueryService } from './lesson-content-query.service';
import { ILessonContent } from './lesson-content.interface';
import { IResponse } from '../../../../shared/types/response';
import { Uuid } from '../../../../shared/types/primitive';

@Controller('v1/course/:courseId/lesson/:lessonId')
export class LessonContentController {
  constructor(
    private readonly lessonContentService: LessonContentService,
    private readonly lessonContentQueryService: LessonContentQueryService,
  ) {}

  @TypedRoute.Get('/')
  async getLessonContents(
    @TypedParam('courseId') courseId: Uuid,
    @TypedParam('lessonId') lessonId: Uuid,
  ): Promise<IResponse<ILessonContent[]>> {
    console.log(courseId, lessonId);
    const iLessonContents = await this.lessonContentQueryService.findLessons();
    return { data: iLessonContents };
  }

  @TypedRoute.Get('/:id')
  async getLessonContent(
    @TypedParam('courseId') courseId: Uuid,
    @TypedParam('lessonId') lessonId: Uuid,
    @TypedParam('id') lessonContentId: Uuid,
  ): Promise<IResponse<ILessonContent | null>> {
    const lessonContent =
      await this.lessonContentQueryService.findLessonContentById({
        id: lessonContentId,
      });
    return { data: lessonContent };
  }
}
