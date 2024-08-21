import { Controller, UseGuards } from '@nestjs/common';
import { LessonService } from './lesson.service';
import {
  TypedBody,
  TypedException,
  TypedHeaders,
  TypedParam,
  TypedRoute,
} from '@nestia/core';
import { LessonQueryService } from './lesson-query.service';
import { Uuid } from '../../../../shared/types/primitive';
import { LessonCreateDto, LessonDto, LessonUpdateDto } from './lesson.dto';
import { TypeGuardError } from 'typia';
import { IErrorResponse } from '../../../../shared/types/response';
import { SkipAuth } from '../../../../core/decorators/skip-auth.decorator';
import { ApiAuthHeaders, AuthHeaders } from '../../../auth/auth.headers';
import { RolesGuard } from '../../../../core/guards/roles.guard';
import { Roles } from '../../../../core/decorators/roles.decorator';

@Controller('v1/course/:courseId/chapter/:chapterId/lesson')
export class LessonController {
  constructor(
    private readonly lessonService: LessonService,
    private readonly lessonQueryService: LessonQueryService,
  ) {}

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
