import { Controller } from '@nestjs/common';
import { CategoryService } from './category.service';
import { TypedBody, TypedRoute } from '@nestia/core';
import { ICategory, ICategoryWithRelations } from './category.interface';
import { IResponse } from '../../shared/types/response';
import { CreateCategoryDto } from './category.dto';

@Controller('/v1/category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @TypedRoute.Get('/')
  async getAllCategories(): Promise<IResponse<ICategoryWithRelations[]>> {
    const rootCategories = await this.categoryService.findRootCategories();
    return { data: rootCategories };
  }

  @TypedRoute.Post('/')
  async createCategory(
    @TypedBody() body: CreateCategoryDto,
  ): Promise<IResponse<ICategory>> {
    const category = await this.categoryService.createCategory(body);
    return { data: category };
  }
}
