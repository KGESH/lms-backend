import { Controller, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
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
  CategoryDto,
  CategoryQuery,
  CategoryWithChildrenDto,
  CategoryWithChildrenQuery,
  CreateCategoryDto,
  UpdateCategoryDto,
} from '@src/v1/category/category.dto';
import { Uuid } from '@src/shared/types/primitive';
import { IErrorResponse } from '@src/shared/types/response';
import { DEFAULT_PAGINATION } from '@src/core/pagination.constant';
import { SkipAuth } from '@src/core/decorators/skip-auth.decorator';
import { RolesGuard } from '@src/core/guards/roles.guard';
import { Roles } from '@src/core/decorators/roles.decorator';
import { ApiAuthHeaders, AuthHeaders } from '@src/v1/auth/auth.headers';

@Controller('v1/category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

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
   * @tag category
   * @summary 강의 카테고리 목록 조회 (public)
   */
  @TypedRoute.Get('/')
  @SkipAuth()
  @TypedException<TypeGuardError>({
    status: 400,
    description: 'invalid request',
  })
  async getRootCategories(
    @TypedHeaders() headers: ApiAuthHeaders,
    @TypedQuery() query?: CategoryQuery,
  ): Promise<CategoryWithChildrenDto[]> {
    if (query?.withChildren) {
      const rootsWithChildren =
        await this.categoryService.getRootCategoriesWithChildren({
          ...DEFAULT_PAGINATION,
          ...query,
        });
      return rootsWithChildren;
    }

    const roots = await this.categoryService.getRootCategories({
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
   * @tag category
   * @summary 강의 카테고리 목록 조회 (public)
   */
  @TypedRoute.Get('/:id')
  @SkipAuth()
  @TypedException<TypeGuardError>({
    status: 400,
    description: 'invalid request',
  })
  async getCategory(
    @TypedHeaders() headers: ApiAuthHeaders,
    @TypedParam('id') id: Uuid,
    @TypedQuery() query?: CategoryWithChildrenQuery,
  ): Promise<CategoryWithChildrenDto | null> {
    if (query?.withChildren) {
      const categoryWithChildren =
        await this.categoryService.findCategoryWithChildren({ id });
      return categoryWithChildren;
    }

    const category = await this.categoryService.findCategory({ id });
    return category;
  }

  @TypedRoute.Post('/')
  @Roles('admin', 'manager')
  @UseGuards(RolesGuard)
  @TypedException<TypeGuardError>({
    status: 400,
    description: 'invalid request',
  })
  async createCategory(
    @TypedHeaders() headers: AuthHeaders,
    @TypedBody() body: CreateCategoryDto,
  ): Promise<CategoryDto> {
    const category = await this.categoryService.createCategory(body);
    return category;
  }

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
  async updateCategory(
    @TypedHeaders() headers: AuthHeaders,
    @TypedParam('id') id: Uuid,
    @TypedBody() body: UpdateCategoryDto,
  ): Promise<CategoryDto> {
    const category = await this.categoryService.updateCategory({ id }, body);
    return category;
  }

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
  async deleteCategory(
    @TypedHeaders() headers: AuthHeaders,
    @TypedParam('id') id: Uuid,
  ): Promise<CategoryDto> {
    const category = await this.categoryService.deleteCategory({ id });
    return category;
  }
}
