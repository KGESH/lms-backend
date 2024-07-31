import { Controller } from '@nestjs/common';
import { LessonService } from './lesson.service';
import { TypedParam, TypedRoute } from '@nestia/core';
import { LessonQueryService } from './lesson-query.service';
import { ILesson } from './lesson.interface';
import { IResponse } from '../../../shared/types/response';
import { Uuid } from '../../../shared/types/primitive';

@Controller('v1/course/:courseId/lesson')
export class LessonController {
  constructor(
    private readonly lessonService: LessonService,
    private readonly lessonQueryService: LessonQueryService,
  ) {}

  @TypedRoute.Get('/')
  async getLessons(
    @TypedParam('courseId') courseId: Uuid,
  ): Promise<IResponse<ILesson[]>> {
    const lessons = await this.lessonQueryService.findLessons();
    return { data: lessons };
  }

  @TypedRoute.Get('/:id')
  async getLesson(
    @TypedParam('courseId') courseId: Uuid,
    @TypedParam('id') lessonId: Uuid,
  ): Promise<IResponse<ILesson | null>> {
    console.log(courseId);
    const lesson = await this.lessonQueryService.findLessonById({
      id: lessonId,
    });
    return { data: lesson };
  }
}
