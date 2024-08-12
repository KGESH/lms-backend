import { Controller } from '@nestjs/common';
import { LessonService } from './lesson.service';
import {
  TypedBody,
  TypedException,
  TypedParam,
  TypedRoute,
} from '@nestia/core';
import { LessonQueryService } from './lesson-query.service';
import { Uuid } from '../../../../shared/types/primitive';
import { LessonCreateDto, LessonDto, LessonUpdateDto } from './lesson.dto';
import { TypeGuardError } from 'typia';
import { IErrorResponse } from '../../../../shared/types/response';

@Controller('v1/course/:courseId/chapter/:chapterId/lesson')
export class LessonController {
  constructor(
    private readonly lessonService: LessonService,
    private readonly lessonQueryService: LessonQueryService,
  ) {}

  @TypedRoute.Get('/')
  async getLessons(
    @TypedParam('courseId') courseId: Uuid,
    @TypedParam('chapterId') chapterId: Uuid,
  ): Promise<LessonDto[]> {
    const lessons = await this.lessonQueryService.findLessons();
    return lessons;
  }

  @TypedException<TypeGuardError>(400, 'invalid request')
  @TypedRoute.Get('/:id')
  async getLesson(
    @TypedParam('courseId') courseId: Uuid,
    @TypedParam('chapterId') chapterId: Uuid,
    @TypedParam('id') lessonId: Uuid,
  ): Promise<LessonDto | null> {
    const lesson = await this.lessonQueryService.findLessonById({
      id: lessonId,
    });
    return lesson;
  }

  @TypedException<TypeGuardError>(400, 'invalid request')
  @TypedException<IErrorResponse<404>>(404, 'chapter not found')
  @TypedRoute.Post('/')
  async createLesson(
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

  @TypedException<TypeGuardError>(400, 'invalid request')
  @TypedException<IErrorResponse<404>>(404, 'lesson not found')
  @TypedRoute.Patch('/:id')
  async updateLesson(
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

  @TypedException<TypeGuardError>(400, 'invalid request')
  @TypedException<IErrorResponse<404>>(404, 'lesson not found')
  @TypedRoute.Delete('/:id')
  async deleteLesson(
    @TypedParam('courseId') courseId: Uuid,
    @TypedParam('chapterId') chapterId: Uuid,
    @TypedParam('id') id: Uuid,
  ): Promise<LessonDto> {
    const lesson = await this.lessonService.deleteLesson({ id });
    return lesson;
  }
}
