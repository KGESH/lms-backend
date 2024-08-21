import { Controller, UseGuards } from '@nestjs/common';
import { CourseService } from './course.service';
import {
  TypedBody,
  TypedException,
  TypedHeaders,
  TypedParam,
  TypedQuery,
  TypedRoute,
} from '@nestia/core';
import { CourseQueryService } from './course-query.service';
import { Uuid } from '../../shared/types/primitive';
import {
  CourseCreateDto,
  CourseDto,
  CourseQuery,
  CourseUpdateDto,
} from './course.dto';
import { CourseWithRelationsDto } from './course-with-relations.dto';
import {
  courseRelationsToDto,
  courseToDto,
} from '../../shared/helpers/transofrm/course';
import { SkipAuth } from '../../core/decorators/skip-auth.decorator';
import { ApiAuthHeaders, AuthHeaders } from '../auth/auth.headers';
import { DEFAULT_PAGINATION } from '../../core/pagination.constant';
import { Roles } from '../../core/decorators/roles.decorator';
import { RolesGuard } from '../../core/guards/roles.guard';
import { TypeGuardError } from 'typia';
import { IErrorResponse } from '../../shared/types/response';

@Controller('v1/course')
export class CourseController {
  constructor(
    private readonly courseService: CourseService,
    private readonly courseQueryService: CourseQueryService,
  ) {}

  @TypedRoute.Get('/')
  @SkipAuth()
  async getCourses(
    @TypedHeaders() headers: ApiAuthHeaders,
    @TypedQuery() query?: CourseQuery,
  ): Promise<CourseDto[]> {
    const courses = await this.courseQueryService.findCourses({
      ...DEFAULT_PAGINATION,
      ...query,
    });
    return courses.map(courseToDto);
  }

  @TypedRoute.Get('/:id')
  @SkipAuth()
  async getCourse(
    @TypedHeaders() headers: ApiAuthHeaders,
    @TypedParam('id') id: Uuid,
  ): Promise<CourseWithRelationsDto | null> {
    const course = await this.courseQueryService.findCourseWithRelations({
      id,
    });

    if (!course) {
      return null;
    }

    return courseRelationsToDto(course);
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
    description: 'category or teacher not found',
  })
  async createCourse(
    @TypedHeaders() headers: AuthHeaders,
    @TypedBody() body: CourseCreateDto,
  ): Promise<CourseDto> {
    const course = await this.courseService.createCourse(body);
    return courseToDto(course);
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
    description: 'course not found',
  })
  async updateCourse(
    @TypedHeaders() headers: AuthHeaders,
    @TypedParam('id') id: Uuid,
    @TypedBody() body: Partial<CourseUpdateDto>,
  ): Promise<CourseDto> {
    const course = await this.courseService.updateCourse({ id }, body);
    return courseToDto(course);
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
    description: 'course not found',
  })
  async deleteCourse(
    @TypedHeaders() headers: AuthHeaders,
    @TypedParam('id') id: Uuid,
  ): Promise<CourseDto> {
    const course = await this.courseService.deleteCourse({ id });
    return courseToDto(course);
  }
}
