import { Controller, Logger, UseGuards } from '@nestjs/common';
import { CourseService } from './course.service';
import { TypeGuardError } from 'typia';
import {
  TypedBody,
  TypedException,
  TypedHeaders,
  TypedParam,
  TypedQuery,
  TypedRoute,
} from '@nestia/core';
import { Uuid } from '@src/shared/types/primitive';
import { CourseQueryService } from '@src/v1/course/course-query.service';
import {
  CourseCreateDto,
  CourseDto,
  CourseQuery,
  CourseUpdateDto,
} from '@src/v1/course/course.dto';
import { CourseWithRelationsDto } from '@src/v1/course/course-with-relations.dto';
import {
  courseRelationsToDto,
  courseToDto,
} from '@src/shared/helpers/transofrm/course';
import { SkipAuth } from '@src/core/decorators/skip-auth.decorator';
import { ApiAuthHeaders, AuthHeaders } from '@src/v1/auth/auth.headers';
import { Roles } from '@src/core/decorators/roles.decorator';
import { RolesGuard } from '@src/core/guards/roles.guard';
import { IErrorResponse } from '@src/shared/types/response';
import { Paginated } from '@src/shared/types/pagination';
import { withDefaultPagination } from '@src/core/pagination';

@Controller('v1/course')
export class CourseController {
  private readonly logger = new Logger(CourseController.name);

  constructor(
    private readonly courseService: CourseService,
    private readonly courseQueryService: CourseQueryService,
  ) {}

  /**
   * 강의 목록을 조회합니다.
   *
   * 로그인 없이 조회할 수 있습니다.
   *
   * 강의 제목과 설명 정도의 간단한 정보만을 제공합니다.
   *
   * Query parameter 'categoryId' 속성을 설정해 해당 카테고리에 속하는 강의 목록만 조회할 수도 있습니다.
   *
   * @tag course
   * @summary 강의 목록 조회 (public)
   */
  @TypedRoute.Get('/')
  @SkipAuth()
  async getCourses(
    @TypedHeaders() headers: ApiAuthHeaders,
    @TypedQuery() query: CourseQuery,
  ): Promise<Paginated<CourseWithRelationsDto[]>> {
    const { data: courses, ...paginated } =
      await this.courseQueryService.findCoursesWithRelations(
        { ...query },
        withDefaultPagination(query),
      );

    return {
      ...paginated,
      data: courses.map(courseRelationsToDto),
    };
  }

  /**
   * 특정 강의를 조회합니다.
   *
   * 로그인 없이 조회할 수 있습니다.
   *
   * 강의 제목과 설명 정도의 간단한 정보만을 제공합니다.
   *
   * @tag course
   * @summary 특정 강의 조회 (public)
   * @param id - 조회할 강의의 id
   */
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

  /**
   * 강의를 생성합니다.
   *
   * 관리자 세션 id를 헤더에 담아서 요청합니다.
   *
   * 강의 생성 이후 'chapter', 'lesson', 'lesson content' 순서로 생성해야 합니다.
   *
   * @tag course
   * @summary 강의 생성 - Role('admin', 'manager', 'teacher')
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
    description: 'category or teacher not found',
  })
  async createCourse(
    @TypedHeaders() headers: AuthHeaders,
    @TypedBody() body: CourseCreateDto,
  ): Promise<CourseDto> {
    const course = await this.courseService.createCourse(body);
    return courseToDto(course);
  }

  /**
   * 강의를 수정합니다.
   *
   * 관리자 세션 id를 헤더에 담아서 요청합니다.
   *
   * 카테고리, 강의 제목, 강의 설명을 수정할 수 있습니다.
   *
   * @tag course
   * @summary 강의 수정 - Role('admin', 'manager', 'teacher')
   * @param id - 수정할 강의의 id
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
    description: 'course not found',
  })
  async updateCourse(
    @TypedHeaders() headers: AuthHeaders,
    @TypedParam('id') id: Uuid,
    @TypedBody() body: CourseUpdateDto,
  ): Promise<CourseDto> {
    const course = await this.courseService.updateCourse({ id }, body);
    return courseToDto(course);
  }

  /**
   * 강의를 삭제합니다. (미완성)
   *
   * 관리자 세션 id를 헤더에 담아서 요청합니다.
   *
   * 현재 Hard delete로 구현되어 있습니다.
   *
   * Soft delete 구현 예정입니다.
   *
   * @tag course
   * @summary 강의 삭제 - Role('admin', 'manager', 'teacher')
   * @deprecated
   * @param id - 삭제할 강의의 id
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
