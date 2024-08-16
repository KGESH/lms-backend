import { Controller } from '@nestjs/common';
import { CategoryService } from './category.service';
import {
  TypedBody,
  TypedException,
  TypedParam,
  TypedRoute,
} from '@nestia/core';
import {
  CategoryDto,
  CategoryWithChildrenDto,
  CreateCategoryDto,
  UpdateCategoryDto,
} from './category.dto';
import { Uuid } from '../../shared/types/primitive';
import { TypeGuardError } from 'typia';
import { IErrorResponse } from '../../shared/types/response';

@Controller('v1/category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @TypedRoute.Get('/')
  async getAllCategories(): Promise<CategoryWithChildrenDto[]> {
    const rootCategories = await this.categoryService.findRootCategories();
    return rootCategories;
  }

  @TypedException<TypeGuardError>({
    status: 400,
    description: 'invalid request',
  })
  @TypedRoute.Get('/:id')
  async getCategory(@TypedParam('id') id: Uuid): Promise<CategoryDto | null> {
    const category = await this.categoryService.findCategory({ id });
    return category;
  }

  @TypedException<TypeGuardError>({
    status: 400,
    description: 'invalid request',
  })
  @TypedRoute.Post('/')
  async createCategory(
    @TypedBody() body: CreateCategoryDto,
  ): Promise<CategoryDto> {
    const category = await this.categoryService.createCategory(body);
    return category;
  }

  @TypedException<TypeGuardError>({
    status: 400,
    description: 'invalid request',
  })
  @TypedException<IErrorResponse<404>>({
    status: 404,
    description: 'category not found',
  })
  @TypedRoute.Patch('/:id')
  async updateCategory(
    @TypedParam('id') id: Uuid,
    @TypedBody() body: UpdateCategoryDto,
  ): Promise<CategoryDto> {
    const category = await this.categoryService.updateCategory({ id }, body);
    return category;
  }

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
  @TypedRoute.Delete('/:id')
  async deleteCategory(@TypedParam('id') id: Uuid): Promise<CategoryDto> {
    const category = await this.categoryService.deleteCategory({ id });
    return category;
  }
}
