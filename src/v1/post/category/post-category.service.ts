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
import { IPostCategoryRelationsWithRoles } from '@src/v1/post/category/post-category-relations.interface';
import { PostCategoryAccessQueryRepository } from '@src/v1/post/category/access/post-category-access-query.repository';

@Injectable()
export class PostCategoryService {
  constructor(
    private readonly postCategoryAccessQueryRepository: PostCategoryAccessQueryRepository,
    private readonly postCategoryRepository: PostCategoryRepository,
    private readonly postCategoryQueryRepository: PostCategoryQueryRepository,
  ) {}

  async getNavbarCategories(): Promise<IPostCategoryRelationsWithRoles[]> {
    const navbarCategories =
      await this.postCategoryQueryRepository.findNavbarCategories();

    const categoryIds = navbarCategories.map((category) => category.id);

    const accesses =
      await this.postCategoryAccessQueryRepository.findPostCategoriesAccesses(
        categoryIds,
      );

    return navbarCategories.map((category) => {
      const access = accesses.find(
        (access) => access.categoryId === category.id,
      );

      return {
        ...category,
        depth: 1,
        children: [],
        readableRoles: access?.readableRoles ?? [],
        writableRoles: access?.writableRoles ?? [],
      };
    });
  }

  async getRootPostCategories(
    pagination: Pagination,
  ): Promise<IPostCategoryRelationsWithRoles[]> {
    const roots =
      await this.postCategoryQueryRepository.findRootCategoriesWithRoles(
        pagination,
      );

    return roots.map((root) => ({
      ...root,
      depth: 1,
      children: [],
    }));
  }

  async getRootPostCategoriesWithRelations(
    pagination: Pagination,
  ): Promise<IPostCategoryRelationsWithRoles[]> {
    const categories =
      await this.postCategoryQueryRepository.findRootCategoriesWithChildren(
        pagination,
      );

    return categories;
  }

  async findPostCategory(
    where: Pick<IPostCategory, 'id'>,
  ): Promise<IPostCategoryRelationsWithRoles | null> {
    const category =
      await this.postCategoryQueryRepository.findPostCategory(where);

    return category;
  }

  async findPostCategoryOrThrow(
    where: Pick<IPostCategory, 'id'>,
  ): Promise<IPostCategoryRelationsWithRoles> {
    const category = await this.findPostCategory(where);

    if (!category) {
      throw new NotFoundException('PostCategory not found');
    }

    return category;
  }

  async findPostCategoryWithRoles(
    where: Pick<IPostCategory, 'id'>,
  ): Promise<IPostCategoryRelationsWithRoles | null> {
    const category =
      await this.postCategoryQueryRepository.findPostCategory(where);

    return category;
  }

  async findPostCategoryWithRelations(
    where: Pick<IPostCategory, 'id'>,
  ): Promise<IPostCategoryRelationsWithRoles | null> {
    const category =
      await this.postCategoryQueryRepository.findPostCategoryWithChildren(
        where,
      );

    return category;
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
