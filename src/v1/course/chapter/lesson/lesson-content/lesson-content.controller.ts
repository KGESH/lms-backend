import { Controller } from '@nestjs/common';
import { LessonContentService } from './lesson-content.service';
import { TypedParam, TypedRoute } from '@nestia/core';
import { LessonContentQueryService } from './lesson-content-query.service';
import { ILessonContent } from './lesson-content.interface';
import { Uuid } from '../../../../../shared/types/primitive';

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
  ): Promise<ILessonContent[]> {
    console.log(courseId, lessonId);
    const lessonContents = await this.lessonContentQueryService.findLessons();
    return lessonContents;
  }

  @TypedRoute.Get('/:id')
  async getLessonContent(
    @TypedParam('courseId') courseId: Uuid,
    @TypedParam('chapterId') chapterId: Uuid,
    @TypedParam('lessonId') lessonId: Uuid,
    @TypedParam('id') lessonContentId: Uuid,
  ): Promise<ILessonContent | null> {
    const lessonContent =
      await this.lessonContentQueryService.findLessonContentById({
        id: lessonContentId,
      });
    return lessonContent;
  }
}
