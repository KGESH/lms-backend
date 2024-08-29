import { Controller, Logger, UseGuards } from '@nestjs/common';
import { CourseCategoryService } from './course-category.service';
import {
  TypedBody,
  TypedException,
  TypedHeaders,
  TypedParam,
  TypedQuery,
  TypedRoute,
} from '@nestia/core';
import { TypeGuardError } from 'typia';
import {
  CourseCategoryDto,
  CourseCategoryQuery,
  CourseCategoryWithChildrenDto,
  CourseCategoryWithChildrenQuery,
  CreateCourseCategoryDto,
  UpdateCourseCategoryDto,
} from '@src/v1/course/category/course-category.dto';
import { Uuid } from '@src/shared/types/primitive';
import { IErrorResponse } from '@src/shared/types/response';
import { DEFAULT_PAGINATION } from '@src/core/pagination.constant';
import { SkipAuth } from '@src/core/decorators/skip-auth.decorator';
import { RolesGuard } from '@src/core/guards/roles.guard';
import { Roles } from '@src/core/decorators/roles.decorator';
import { ApiAuthHeaders, AuthHeaders } from '@src/v1/auth/auth.headers';

@Controller('v1/course-category')
export class CourseCategoryController {
  private readonly logger = new Logger(CourseCategoryController.name);

  constructor(private readonly categoryService: CourseCategoryService) {}

  /**
   * 강의 카테고리 목록을 조회합니다.
   *
   * 로그인 없이 조회할 수 있습니다.
   *
   * Query parameter 'withChildren' 속성을 설정해 하위 카테고리 목록을 조회할 수 있습니다.
   *
   * Query parameter 'withChildren' 속성을 명시하지 않으면 기본값은 false 입니다.
   *
   * Query parameter 'withChildren' 속성이 false 일때, 하위 카테고리 목록은 빈 배열로 반환됩니다.
   *
   * @tag course-category
   * @summary 강의 카테고리 목록 조회 (public)
   */
  @TypedRoute.Get('/')
  @SkipAuth()
  @TypedException<TypeGuardError>({
    status: 400,
    description: 'invalid request',
  })
  async getRootCourseCategories(
    @TypedHeaders() headers: ApiAuthHeaders,
    @TypedQuery() query?: CourseCategoryQuery,
  ): Promise<CourseCategoryWithChildrenDto[]> {
    if (query?.withChildren) {
      const rootsWithChildren =
        await this.categoryService.getRootCategoriesWithChildren({
          ...DEFAULT_PAGINATION,
          ...query,
        });
      return rootsWithChildren;
    }

    const roots = await this.categoryService.getRootCourseCategories({
      ...DEFAULT_PAGINATION,
      ...query,
    });
    return roots;
  }

  /**
   * 특정 강의 카테고리를 조회합니다.
   *
   * 로그인 없이 조회할 수 있습니다.
   *
   * Query parameter 'withChildren' 속성을 설정해 하위 카테고리 목록을 조회할 수 있습니다.
   *
   * Query parameter 'withChildren' 속성을 명시하지 않으면 기본값은 false 입니다.
   *
   * Query parameter 'withChildren' 속성이 false 일때, 하위 카테고리 목록은 빈 배열로 반환됩니다.
   *
   * @tag course-category
   * @summary 강의 카테고리 목록 조회 (public)
   */
  @TypedRoute.Get('/:id')
  @SkipAuth()
  @TypedException<TypeGuardError>({
    status: 400,
    description: 'invalid request',
  })
  async getCourseCategory(
    @TypedHeaders() headers: ApiAuthHeaders,
    @TypedParam('id') id: Uuid,
    @TypedQuery() query?: CourseCategoryWithChildrenQuery,
  ): Promise<CourseCategoryWithChildrenDto | null> {
    this.logger.verbose('[GET v1/course/category/:id]');
    if (query?.withChildren) {
      const categoryWithChildren =
        await this.categoryService.findCourseCategoryWithChildren({ id });
      return categoryWithChildren;
    }

    const category = await this.categoryService.findCourseCategory({ id });
    return category;
  }

  /**
   * 강의 카테고리를 생성합니다.
   *
   * 관리자 세션 id를 헤더에 담아서 요청합니다.
   *
   * @tag course-category
   * @summary 강의 카테고리 생성 - Role('admin', 'manager')
   */
  @TypedRoute.Post('/')
  @Roles('admin', 'manager')
  @UseGuards(RolesGuard)
  @TypedException<TypeGuardError>({
    status: 400,
    description: 'invalid request',
  })
  async createCourseCategory(
    @TypedHeaders() headers: AuthHeaders,
    @TypedBody() body: CreateCourseCategoryDto,
  ): Promise<CourseCategoryDto> {
    const category = await this.categoryService.createCourseCategory(body);
    return category;
  }

  /**
   * 강의 카테고리를 수정합니다.
   *
   * 관리자 세션 id를 헤더에 담아서 요청합니다.
   *
   * @tag course-category
   * @summary 강의 카테고리 수정 - Role('admin', 'manager')
   * @param id - 수정할 강의 카테고리의 id
   */
  @TypedRoute.Patch('/:id')
  @Roles('admin', 'manager')
  @UseGuards(RolesGuard)
  @TypedException<TypeGuardError>({
    status: 400,
    description: 'invalid request',
  })
  @TypedException<IErrorResponse<404>>({
    status: 404,
    description: 'category not found',
  })
  async updateCourseCategory(
    @TypedHeaders() headers: AuthHeaders,
    @TypedParam('id') id: Uuid,
    @TypedBody() body: UpdateCourseCategoryDto,
  ): Promise<CourseCategoryDto> {
    const category = await this.categoryService.updateCourseCategory(
      { id },
      body,
    );
    return category;
  }

  /**
   * 강의 카테고리를 삭제합니다.
   *
   * 관리자 세션 id를 헤더에 담아서 요청합니다.
   *
   * Hard delete로 구현되어 있습니다.
   *
   * 삭제 대상 카테고리와 연관된 강의가 존재하면 403 예외를 반환합니다.
   *
   * 삭제 대상 카테고리와 연관된 강의를 먼저 삭제해야 합니다.
   *
   * @tag course-category
   * @summary 강의 카테고리 삭제 - Role('admin', 'manager')
   * @param id - 삭제할 강의 카테고리의 id
   */
  @TypedRoute.Delete('/:id')
  @Roles('admin', 'manager')
  @UseGuards(RolesGuard)
  @TypedException<TypeGuardError>({
    status: 400,
    description: 'invalid request',
  })
  @TypedException<IErrorResponse<403>>({
    status: 403,
    description: 'category has courses',
  })
  @TypedException<IErrorResponse<404>>({
    status: 404,
    description: 'category not found',
  })
  async deleteCourseCategory(
    @TypedHeaders() headers: AuthHeaders,
    @TypedParam('id') id: Uuid,
  ): Promise<CourseCategoryDto> {
    const category = await this.categoryService.deleteCourseCategory({ id });
    return category;
  }
}
