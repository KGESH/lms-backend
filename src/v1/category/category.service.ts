import { Injectable, NotFoundException } from '@nestjs/common';
import { CategoryRepository } from './category.repository';
import { ICategory, ICategoryWithRelations } from './category.interface';
import { TransactionClient } from '../../infra/db/drizzle.types';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async findCategory(where: Pick<ICategory, 'id'>): Promise<ICategory | null> {
    return await this.categoryRepository.findOne(where);
  }

  async findRootCategories(): Promise<ICategoryWithRelations[]> {
    return await this.categoryRepository.findManyRootCategoriesWithChildren();
  }

  async createCategory(
    params: Pick<ICategory, 'name' | 'parentId' | 'description'>,
  ): Promise<ICategory> {
    return await this.categoryRepository.create(params);
  }

  async updateCategory(
    where: Pick<ICategory, 'id'>,
    params: Partial<ICategory>,
    tx?: TransactionClient,
  ): Promise<ICategory> {
    const exist = await this.categoryRepository.findOne({ id: where.id });

    if (!exist) {
      throw new NotFoundException('Category not found');
    }

    return await this.categoryRepository.update(where, params, tx);
  }

  async deleteCategory(where: Pick<ICategory, 'id'>): Promise<ICategory> {
    const exist = await this.categoryRepository.findOneWithCourses({
      id: where.id,
    });

    if (!exist) {
      throw new Error('Category not found');
    }

    if (exist.courses.length > 0) {
      throw new Error('Category has courses');
    }

    return await this.categoryRepository.delete(where);
  }
}
