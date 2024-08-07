import { Controller } from '@nestjs/common';
import { CategoryService } from './category.service';
import { TypedBody, TypedParam, TypedRoute } from '@nestia/core';
import { ICategory, ICategoryWithRelations } from './category.interface';
// import { IResponse } from '../../shared/types/response';
import { CreateCategoryDto, UpdateCategoryDto } from './category.dto';
import { Uuid } from '../../shared/types/primitive';

@Controller('/v1/category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @TypedRoute.Get('/')
  async getAllCategories(): Promise<ICategoryWithRelations[]> {
    // async getAllCategories(): Promise<IResponse<ICategoryWithRelations[]>> {
    const rootCategories = await this.categoryService.findRootCategories();
    return rootCategories;
    // return { data: rootCategories };
  }

  @TypedRoute.Get('/:id')
  async getCategory(@TypedParam('id') id: Uuid): Promise<ICategory | null> {
    // ): Promise<IResponse<ICategory | null>> {
    const category = await this.categoryService.findCategory({ id });
    return category;
    // return { data: category };
  }

  @TypedRoute.Post('/')
  async createCategory(
    @TypedBody() body: CreateCategoryDto,
  ): Promise<ICategory> {
    const category = await this.categoryService.createCategory(body);
    return category;
    // return { data: category };
  }

  @TypedRoute.Patch('/:id')
  async updateCategory(
    @TypedParam('id') id: Uuid,
    @TypedBody() body: UpdateCategoryDto,
  ): Promise<ICategory> {
    const category = await this.categoryService.updateCategory({ id }, body);
    return category;
    // return { data: category };
  }

  @TypedRoute.Delete('/:id')
  async deleteCategory(@TypedParam('id') id: Uuid): Promise<ICategory> {
    const category = await this.categoryService.deleteCategory({ id });
    return category;
    // return { data: category };
  }
}
