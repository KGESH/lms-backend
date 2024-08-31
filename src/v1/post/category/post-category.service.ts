import { Injectable, NotFoundException } from '@nestjs/common';
import { PostCategoryRepository } from '@src/v1/post/category/post-category.repository';
import {
  IPostCategory,
  IPostCategoryCreate,
  IPostCategoryUpdate,
  IPostCategoryWithRelations,
} from '@src/v1/post/category/post-category.interface';
import { PostCategoryQueryRepository } from '@src/v1/post/category/post-category-query.repository';
import { Pagination } from '@src/shared/types/pagination';

@Injectable()
export class PostCategoryService {
  constructor(
    private readonly postCategoryRepository: PostCategoryRepository,
    private readonly postCategoryQueryRepository: PostCategoryQueryRepository,
  ) {}

  async getRootPostCategories(
    pagination: Pagination,
  ): Promise<IPostCategoryWithRelations[]> {
    const roots =
      await this.postCategoryQueryRepository.findRootCategories(pagination);

    return roots.map((root) => ({
      ...root,
      depth: 1,
      children: [],
    }));
  }

  async getRootPostCategoriesWithChildren(
    pagination: Pagination,
  ): Promise<IPostCategoryWithRelations[]> {
    return await this.postCategoryQueryRepository.findRootCategoriesWithChildren(
      pagination,
    );
  }

  async findPostCategory(
    where: Pick<IPostCategory, 'id'>,
  ): Promise<IPostCategoryWithRelations | null> {
    const category =
      await this.postCategoryQueryRepository.findPostCategory(where);

    if (!category) {
      return null;
    }

    return {
      ...category,
      depth: 1,
      children: [],
    };
  }

  async findPostCategoryOrThrow(
    where: Pick<IPostCategory, 'id'>,
  ): Promise<IPostCategoryWithRelations> {
    const category = await this.findPostCategory(where);

    if (!category) {
      throw new NotFoundException('PostCategory not found');
    }

    return category;
  }

  async findPostCategoryWithChildren(
    where: Pick<IPostCategory, 'id'>,
  ): Promise<IPostCategoryWithRelations | null> {
    return await this.postCategoryQueryRepository.findPostCategoryWithChildren(
      where,
    );
  }

  async findPostCategoryWithChildrenOrThrow(
    where: Pick<IPostCategory, 'id'>,
  ): Promise<IPostCategoryWithRelations> {
    return await this.postCategoryQueryRepository.findPostCategoryWithChildrenOrThrow(
      where,
    );
  }

  async createPostCategory(
    params: IPostCategoryCreate,
  ): Promise<IPostCategory> {
    return await this.postCategoryRepository.createPostCategory(params);
  }

  async updatePostCategory(
    where: Pick<IPostCategory, 'id'>,
    params: IPostCategoryUpdate,
  ): Promise<IPostCategory> {
    await this.findPostCategoryOrThrow(where);
    return await this.postCategoryRepository.updatePostCategory(where, params);
  }

  async deletePostCategory(where: Pick<IPostCategory, 'id'>): Promise<void> {
    await this.findPostCategoryOrThrow(where);
    return await this.postCategoryRepository.deletePostCategory(where);
  }
}
