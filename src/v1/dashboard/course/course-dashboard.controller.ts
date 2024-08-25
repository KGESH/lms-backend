import { Controller, UseGuards } from '@nestjs/common';
import { CourseDashboardService } from '@src/v1/dashboard/course/course-dashboard.service';
import {
  TypedBody,
  TypedException,
  TypedHeaders,
  TypedParam,
  TypedRoute,
} from '@nestia/core';
import {
  CourseDashboardDto,
  CourseDashboardUpdateDto,
} from '@src/v1/dashboard/course/course-dashboard.dto';
import { Uuid } from '@src/shared/types/primitive';
import { Roles } from '@src/core/decorators/roles.decorator';
import { RolesGuard } from '@src/core/guards/roles.guard';
import { TypeGuardError } from 'typia';
import { AuthHeaders } from '@src/v1/auth/auth.headers';

@Controller('v1/dashboard/course/:courseId')
export class CourseDashboardController {
  constructor(
    private readonly courseDashboardService: CourseDashboardService,
  ) {}

  /**
   * 강의의 챕터와 레슨 순서를 변경합니다.
   *
   * 관리자 세션 id를 헤더에 담아서 요청합니다.
   *
   * @tag dashboard-course
   * @summary 챕터, 레슨 순서 변경 - Role('admin', 'manager', 'teacher')
   * @param courseId - 강의 id
   */
  @Roles('admin', 'manager', 'teacher')
  @UseGuards(RolesGuard)
  @TypedException<TypeGuardError>({
    status: 400,
    description: 'invalid request',
  })
  @TypedException<TypeGuardError>({
    status: 404,
    description: 'item not found',
  })
  @TypedRoute.Patch('/')
  async updateDashboardSequence(
    @TypedHeaders() headers: AuthHeaders,
    @TypedParam('courseId') courseId: Uuid,
    @TypedBody() body: CourseDashboardUpdateDto,
  ): Promise<CourseDashboardDto> {
    const { updatedChapters, updatedLessons } =
      await this.courseDashboardService.updateDashboardSequence(body);
    return { chapters: updatedChapters, lessons: updatedLessons };
  }
}
