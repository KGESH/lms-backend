import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CategoryRepository } from '@src/v1/category/category.repository';
import {
  ICategory,
  ICategoryCreate,
  ICategoryUpdate,
  ICategoryWithChildren,
} from './category.interface';
import { TransactionClient } from '@src/infra/db/drizzle.types';
import { Pagination } from '@src/shared/types/pagination';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async findCategory(
    where: Pick<ICategory, 'id'>,
  ): Promise<ICategoryWithChildren | null> {
    const category =
      await this.categoryRepository.findCategoryWithChildren(where);

    if (!category) {
      return null;
    }

    return {
      ...category,
      children: [],
    };
  }

  async findCategoryWithChildren(
    where: Pick<ICategory, 'id'>,
  ): Promise<ICategoryWithChildren | null> {
    return await this.categoryRepository.findCategoryWithChildren(where);
  }

  async getRootCategories(
    pagination: Pagination,
  ): Promise<ICategoryWithChildren[]> {
    const roots = await this.categoryRepository.findRootCategories(pagination);
    return roots.map((root) => ({
      ...root,
      children: [],
    }));
  }

  async getRootCategoriesWithChildren(
    pagination: Pagination,
  ): Promise<ICategoryWithChildren[]> {
    return await this.categoryRepository.findRootCategoriesWithChildren(
      pagination,
    );
  }

  async createCategory(params: ICategoryCreate): Promise<ICategory> {
    return await this.categoryRepository.createCategory(params);
  }

  async updateCategory(
    where: Pick<ICategory, 'id'>,
    params: ICategoryUpdate,
    tx?: TransactionClient,
  ): Promise<ICategory> {
    const exist = await this.categoryRepository.findCategory({ id: where.id });

    if (!exist) {
      throw new NotFoundException('Category not found');
    }

    return await this.categoryRepository.updateCategory(where, params, tx);
  }

  async deleteCategory(where: Pick<ICategory, 'id'>): Promise<ICategory> {
    const exist = await this.categoryRepository.findCategoryWithCourses({
      id: where.id,
    });

    if (!exist) {
      throw new NotFoundException('Category not found');
    }

    if (exist.courses.length > 0) {
      throw new ForbiddenException(
        'Category has courses. If you want to delete it, please delete the courses first',
      );
    }

    return await this.categoryRepository.deleteCategory(where);
  }
}
