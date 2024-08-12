import { Injectable, NotFoundException } from '@nestjs/common';
import { DrizzleService } from '../../infra/db/drizzle.service';
import { asc, desc, eq, isNull } from 'drizzle-orm';
import { dbSchema } from '../../infra/db/schema';
import {
  ICategory,
  ICategoryCreate,
  ICategoryWithChildren,
} from './category.interface';
import { ICourse } from '../course/course.interface';
import { IRepository } from '../../core/base.repository';
import { IPagination } from 'src/shared/types/pagination';

@Injectable()
export class CategoryRepository implements IRepository<ICategory> {
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

  async findMany(pagination: IPagination): Promise<ICategory[]> {
    const categories = await this.drizzle.db
      .select()
      .from(dbSchema.courseCategories)
      .where(
        pagination.cursor
          ? eq(dbSchema.courseCategories.id, pagination.cursor)
          : undefined,
      )
      .limit(pagination.pageSize)
      .orderBy(
        pagination.orderBy === 'asc'
          ? asc(dbSchema.courseCategories.id)
          : desc(dbSchema.courseCategories.id),
      );
    return categories;
  }

  // Todo: extract
  async findOneWithCourses(
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

  async findManyRootCategoriesWithChildren(): Promise<ICategoryWithChildren[]> {
    const rootCategories =
      await this.drizzle.db.query.courseCategories.findMany({
        where: isNull(dbSchema.courseCategories.parentId),
        with: {
          children: {
            with: {
              children: {
                with: {
                  children: true,
                },
              },
            },
          },
        },
      });

    return rootCategories;
  }

  async create(
    params: ICategoryCreate,
    db = this.drizzle.db,
  ): Promise<ICategory> {
    const [category] = await db
      .insert(dbSchema.courseCategories)
      .values(params)
      .returning();
    return category;
  }

  async update(
    where: Pick<ICategory, 'id'>,
    params: Partial<ICategory>,
    db = this.drizzle.db,
  ): Promise<ICategory> {
    const [category] = await db
      .update(dbSchema.courseCategories)
      .set(params)
      .where(eq(dbSchema.courseCategories.id, where.id))
      .returning();
    return category;
  }

  async delete(
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
