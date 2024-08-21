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
import {
  CategoryDto,
  CategoryQuery,
  CategoryWithChildrenDto,
  CreateCategoryDto,
  UpdateCategoryDto,
} from './category.dto';
import { Uuid } from '../../shared/types/primitive';
import { TypeGuardError } from 'typia';
import { IErrorResponse } from '../../shared/types/response';
import { DEFAULT_PAGINATION } from '../../core/pagination.constant';
import { SkipAuth } from '../../core/decorators/skip-auth.decorator';
import { RolesGuard } from '../../core/guards/roles.guard';
import { Roles } from '../../core/decorators/roles.decorator';
import { ApiAuthHeaders, AuthHeaders } from '../auth/auth.headers';

@Controller('v1/category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @TypedRoute.Get('/')
  @SkipAuth()
  @TypedException<TypeGuardError>({
    status: 400,
    description: 'invalid request',
  })
  async getRootCategories(
    @TypedHeaders() headers: ApiAuthHeaders,
    @TypedQuery() query: CategoryQuery,
  ): Promise<CategoryWithChildrenDto[]> {
    if (query.withChildren) {
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

  @TypedRoute.Get('/:id')
  @SkipAuth()
  @TypedException<TypeGuardError>({
    status: 400,
    description: 'invalid request',
  })
  async getCategory(
    @TypedHeaders() headers: ApiAuthHeaders,
    @TypedParam('id') id: Uuid,
  ): Promise<CategoryDto | null> {
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
