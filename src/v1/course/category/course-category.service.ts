import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CourseCategoryRepository } from '@src/v1/course/category/course-category.repository';
import {
  ICourseCategory,
  ICourseCategoryCreate,
  ICourseCategoryUpdate,
  ICourseCategoryWithChildren,
} from './course-category.interface';
import { TransactionClient } from '@src/infra/db/drizzle.types';
import { Pagination } from '@src/shared/types/pagination';
import { CourseCategoryQueryRepository } from '@src/v1/course/category/course-category-query.repository';

@Injectable()
export class CourseCategoryService {
  constructor(
    private readonly courseCategoryRepository: CourseCategoryRepository,
    private readonly courseCategoryQueryRepository: CourseCategoryQueryRepository,
  ) {}

  async findCourseCategory(
    where: Pick<ICourseCategory, 'id'>,
  ): Promise<ICourseCategoryWithChildren | null> {
    const category =
      await this.courseCategoryQueryRepository.findCourseCategoryWithChildren(
        where,
      );

    if (!category) {
      return null;
    }

    return {
      ...category,
      children: [],
    };
  }

  async findCourseCategoryWithChildren(
    where: Pick<ICourseCategory, 'id'>,
  ): Promise<ICourseCategoryWithChildren | null> {
    return await this.courseCategoryQueryRepository.findCourseCategoryWithChildren(
      where,
    );
  }

  async getRootCourseCategories(
    pagination: Pagination,
  ): Promise<ICourseCategoryWithChildren[]> {
    const roots =
      await this.courseCategoryQueryRepository.findRootCategories(pagination);
    return roots.map((root) => ({
      ...root,
      children: [],
    }));
  }

  async getRootCategoriesWithChildren(
    pagination: Pagination,
  ): Promise<ICourseCategoryWithChildren[]> {
    return await this.courseCategoryQueryRepository.findRootCategoriesWithChildren(
      pagination,
    );
  }

  async createCourseCategory(
    params: ICourseCategoryCreate,
  ): Promise<ICourseCategory> {
    if (params.parentId) {
      const parent =
        await this.courseCategoryQueryRepository.findCourseCategory({
          id: params.parentId,
        });

      if (!parent) {
        throw new NotFoundException('Parent category not found');
      }
    }

    return await this.courseCategoryRepository.createCourseCategory(params);
  }

  async updateCourseCategory(
    where: Pick<ICourseCategory, 'id'>,
    params: ICourseCategoryUpdate,
    tx?: TransactionClient,
  ): Promise<ICourseCategory> {
    const exist = await this.courseCategoryQueryRepository.findCourseCategory({
      id: where.id,
    });

    if (!exist) {
      throw new NotFoundException('CourseCategory not found');
    }

    if (params.parentId) {
      const parent =
        await this.courseCategoryQueryRepository.findCourseCategory({
          id: params.parentId,
        });

      if (!parent) {
        throw new NotFoundException('Parent category not found');
      }
    }

    return await this.courseCategoryRepository.updateCourseCategory(
      where,
      params,
      tx,
    );
  }

  async deleteCourseCategory(
    where: Pick<ICourseCategory, 'id'>,
  ): Promise<ICourseCategory> {
    const exist =
      await this.courseCategoryQueryRepository.findCourseCategoryWithCourses({
        id: where.id,
      });

    if (!exist) {
      throw new NotFoundException('CourseCategory not found');
    }

    if (exist.courses.length > 0) {
      throw new ForbiddenException(
        'CourseCategory has courses. If you want to delete it, please delete the courses first',
      );
    }

    return await this.courseCategoryRepository.deleteCourseCategory(where);
  }
}
