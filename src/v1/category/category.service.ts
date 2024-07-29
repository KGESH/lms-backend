import { Injectable } from '@nestjs/common';
import { CategoryRepository } from './category.repository';
import { ICategory, ICategoryWithRelations } from './category.interface';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async findRootCategories(): Promise<ICategoryWithRelations[]> {
    return await this.categoryRepository.findManyRootCategoriesWithChildren();
  }

  async createCategory(
    params: Pick<ICategory, 'name' | 'parentId' | 'description'>,
  ): Promise<ICategory> {
    return await this.categoryRepository.create(params);
  }
}
