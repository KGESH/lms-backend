import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  IEbookCategory,
  IEbookCategoryCreate,
  IEbookCategoryUpdate,
  IEbookCategoryWithChildren,
} from './ebook-category.interface';
import { TransactionClient } from '@src/infra/db/drizzle.types';
import { Pagination } from '@src/shared/types/pagination';
import { EbookCategoryRepository } from '@src/v1/ebook/category/ebook-category.repository';
import { EbookCategoryQueryRepository } from '@src/v1/ebook/category/ebook-category-query.repository';

@Injectable()
export class EbookCategoryService {
  constructor(
    private readonly ebookCategoryRepository: EbookCategoryRepository,
    private readonly ebookCategoryQueryRepository: EbookCategoryQueryRepository,
  ) {}

  async findEbookCategory(
    where: Pick<IEbookCategory, 'id'>,
  ): Promise<IEbookCategoryWithChildren | null> {
    const category =
      await this.ebookCategoryQueryRepository.findEbookCategory(where);

    if (!category) {
      return null;
    }

    return {
      ...category,
      children: [],
    };
  }

  async findEbookCategoryOrThrow(
    where: Pick<IEbookCategory, 'id'>,
  ): Promise<IEbookCategoryWithChildren> {
    const category = await this.findEbookCategory(where);

    if (!category) {
      throw new NotFoundException('EbookCategory not found');
    }

    return category;
  }

  async findEbookCategoryWithChildren(
    where: Pick<IEbookCategory, 'id'>,
  ): Promise<IEbookCategoryWithChildren | null> {
    return await this.ebookCategoryQueryRepository.findCategoryWithChildren(
      where,
    );
  }

  async getRootCategories(
    pagination: Pagination,
  ): Promise<IEbookCategoryWithChildren[]> {
    const roots =
      await this.ebookCategoryQueryRepository.findRootCategories(pagination);
    return roots.map((root) => ({
      ...root,
      children: [],
    }));
  }

  async getRootCategoriesWithChildren(
    pagination: Pagination,
  ): Promise<IEbookCategoryWithChildren[]> {
    return await this.ebookCategoryQueryRepository.findRootCategoriesWithChildren(
      pagination,
    );
  }

  async createEbookCategory(
    params: IEbookCategoryCreate,
  ): Promise<IEbookCategory> {
    if (params.parentId) {
      const parent = await this.ebookCategoryQueryRepository.findEbookCategory({
        id: params.parentId,
      });

      if (!parent) {
        throw new NotFoundException('Parent category not found');
      }
    }

    return await this.ebookCategoryRepository.createCategory(params);
  }

  async updateEbookCategory(
    where: Pick<IEbookCategory, 'id'>,
    params: IEbookCategoryUpdate,
    tx?: TransactionClient,
  ): Promise<IEbookCategory> {
    const exist =
      await this.ebookCategoryQueryRepository.findEbookCategoryOrThrow({
        id: where.id,
      });

    if (!exist) {
      throw new NotFoundException('EbookCategory not found');
    }

    return await this.ebookCategoryRepository.updateCategory(where, params, tx);
  }

  async deleteEbookCategory(
    where: Pick<IEbookCategory, 'id'>,
  ): Promise<IEbookCategory> {
    const exist =
      await this.ebookCategoryQueryRepository.findCategoryWithEbooks({
        id: where.id,
      });

    if (!exist) {
      throw new NotFoundException('EbookCategory not found');
    }

    if (exist.ebooks.length > 0) {
      throw new ForbiddenException(
        'EbookCategory has courses. If you want to delete it, please delete the courses first',
      );
    }

    return await this.ebookCategoryRepository.deleteCategory(where);
  }
}
