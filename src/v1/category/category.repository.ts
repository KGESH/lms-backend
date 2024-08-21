import { Injectable, NotFoundException } from '@nestjs/common';
import { DrizzleService } from '../../infra/db/drizzle.service';
import { eq, isNull } from 'drizzle-orm';
import { dbSchema } from '../../infra/db/schema';
import {
  ICategory,
  ICategoryCreate,
  ICategoryUpdate,
  ICategoryWithRelations,
} from './category.interface';
import { ICourse } from '../course/course.interface';
import { Pagination } from 'src/shared/types/pagination';
import { getRootCategoriesRawSql } from '../../../test/e2e/helpers/db/lms/category.helper';

@Injectable()
export class CategoryRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async findOne(where: Pick<ICategory, 'id'>): Promise<ICategory | null> {
    const category = await this.drizzle.db.query.courseCategories.findFirst({
      where: eq(dbSchema.courseCategories.id, where.id),
    });

    if (!category) {
      return null;
    }

    return category;
  }

  async findOneOrThrow(where: Pick<ICategory, 'id'>): Promise<ICategory> {
    const category = await this.findOne(where);

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  async findRootCategories(pagination: Pagination): Promise<ICategory[]> {
    const roots = await this.drizzle.db.query.courseCategories.findMany({
      where: isNull(dbSchema.courseCategories.parentId),
      orderBy: (category, { asc }) => asc(category.name),
      offset: (pagination.page - 1) * pagination.pageSize,
      limit: pagination.pageSize,
    });

    return roots;
  }

  // Todo: extract
  async findCategoryWithCourses(
    where: Pick<ICategory, 'id'>,
  ): Promise<(ICategory & { courses: ICourse[] }) | null> {
    const category = await this.drizzle.db.query.courseCategories.findFirst({
      where: eq(dbSchema.courseCategories.id, where.id),
      with: {
        courses: true,
      },
    });

    if (!category) {
      return null;
    }

    return category;
  }

  async findRootCategoriesWithChildren(
    pagination: Pagination,
  ): Promise<ICategoryWithRelations[]> {
    const rootCategories = await getRootCategoriesRawSql(
      pagination,
      this.drizzle.db,
    );

    return rootCategories;
  }

  async createCategory(
    params: ICategoryCreate,
    db = this.drizzle.db,
  ): Promise<ICategory> {
    const [category] = await db
      .insert(dbSchema.courseCategories)
      .values(params)
      .returning();
    return category;
  }

  async updateCategory(
    where: Pick<ICategory, 'id'>,
    params: ICategoryUpdate,
    db = this.drizzle.db,
  ): Promise<ICategory> {
    const [category] = await db
      .update(dbSchema.courseCategories)
      .set(params)
      .where(eq(dbSchema.courseCategories.id, where.id))
      .returning();
    return category;
  }

  async deleteCategory(
    where: Pick<ICategory, 'id'>,
    db = this.drizzle.db,
  ): Promise<ICategory> {
    const [category] = await db
      .delete(dbSchema.courseCategories)
      .where(eq(dbSchema.courseCategories.id, where.id))
      .returning();
    return category;
  }
}
