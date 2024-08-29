import { Injectable, NotFoundException } from '@nestjs/common';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import {
  ICourseCategory,
  ICourseCategoryWithRelations,
} from '@src/v1/course/category/course-category.interface';
import { dbSchema } from '@src/infra/db/schema';
import { ICourse } from '@src/v1/course/course.interface';
import { TransactionClient } from '@src/infra/db/drizzle.types';
import { asc, desc, eq, isNull, sql } from 'drizzle-orm';
import { Uuid } from '@src/shared/types/primitive';
import { Pagination } from '@src/shared/types/pagination';
import * as typia from 'typia';

@Injectable()
export class CourseCategoryQueryRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async findCourseCategory(
    where: Pick<ICourseCategory, 'id'>,
  ): Promise<ICourseCategory | null> {
    const category = await this.drizzle.db.query.courseCategories.findFirst({
      where: eq(dbSchema.courseCategories.id, where.id),
    });

    if (!category) {
      return null;
    }

    return category;
  }

  async findCourseCategoryOrThrow(
    where: Pick<ICourseCategory, 'id'>,
  ): Promise<ICourseCategory> {
    const category = await this.findCourseCategory(where);

    if (!category) {
      throw new NotFoundException('CourseCategory not found');
    }

    return category;
  }

  async findCourseCategoryWithChildren(
    where: Pick<ICourseCategory, 'id'>,
  ): Promise<ICourseCategoryWithRelations | null> {
    const category = await this._getCourseCategoryWithChildrenRawSql(
      where,
      this.drizzle.db,
    );

    return category;
  }

  async findCourseCategoryWithChildrenOrThrow(
    where: Pick<ICourseCategory, 'id'>,
  ): Promise<ICourseCategoryWithRelations> {
    const category = await this.findCourseCategoryWithChildren(where);

    if (!category) {
      throw new NotFoundException('CourseCategory not found');
    }

    return category;
  }

  async findRootCategories(pagination: Pagination): Promise<ICourseCategory[]> {
    const roots = await this.drizzle.db.query.courseCategories.findMany({
      where: isNull(dbSchema.courseCategories.parentId),
      orderBy: (category, { asc, desc }) =>
        pagination.orderBy === 'asc' ? asc(category.name) : desc(category.name),
      offset: (pagination.page - 1) * pagination.pageSize,
      limit: pagination.pageSize,
    });

    return roots;
  }

  // Todo: extract
  async findCourseCategoryWithCourses(
    where: Pick<ICourseCategory, 'id'>,
  ): Promise<(ICourseCategory & { courses: ICourse[] }) | null> {
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
  ): Promise<ICourseCategoryWithRelations[]> {
    const rootCategories = await this._getRootCourseCategoriesRawSql(
      pagination,
      this.drizzle.db,
    );

    return rootCategories;
  }

  private async _getCourseCategoryWithChildrenRawSql(
    where: Pick<ICourseCategory, 'id'>,
    db: TransactionClient,
  ): Promise<ICourseCategoryWithRelations | null> {
    const categorySQL = db
      .select({
        id: dbSchema.courseCategories.id,
        name: dbSchema.courseCategories.name,
        parentId: dbSchema.courseCategories.parentId,
        description: dbSchema.courseCategories.description,
        depth: sql<number>`1`.as('depth'),
      })
      .from(dbSchema.courseCategories)
      .where(eq(dbSchema.courseCategories.id, where.id));

    const rawSql = sql`
      WITH RECURSIVE category_hierarchy AS (
            (${categorySQL})
            UNION ALL
            (SELECT c.id,
                    c.name,
                    c.parent_id,
                    c.description,
                    ch.depth + 1
             FROM ${dbSchema.courseCategories} AS c
                      INNER JOIN
                  category_hierarchy AS ch ON c.parent_id = ch.id))
      SELECT *
      FROM category_hierarchy
      ORDER BY depth ASC;
  `;

    const result = await db.execute<{
      id: Uuid;
      name: string;
      parent_id: Uuid;
      description: string;
      depth: number;
    }>(rawSql);

    // rows[0] is root category.
    // because order by depth asc.
    if (!result.rows[0]) {
      return null;
    }

    const root = result.rows[0];
    const children: ICourseCategoryWithRelations[] = result.rows
      .slice(1)
      .map((row) => ({
        id: row.id,
        parentId: row.parent_id,
        name: row.name,
        description: row.description,
        depth: row.depth,
        children: [],
      }));
    const rootCategory: ICourseCategoryWithRelations = {
      id: root.id,
      parentId: root.parent_id,
      name: root.name,
      description: root.description,
      depth: root.depth,
      children,
    };

    return rootCategory;
  }

  private async _getRootCourseCategoriesRawSql(
    pagination: Pagination,
    db: TransactionClient,
  ): Promise<ICourseCategoryWithRelations[]> {
    const rootCategorySQL = db
      .select({
        id: dbSchema.courseCategories.id,
        name: dbSchema.courseCategories.name,
        parentId: dbSchema.courseCategories.parentId,
        description: dbSchema.courseCategories.description,
        depth: sql<number>`1`.as('depth'),
      })
      .from(dbSchema.courseCategories)
      .where(isNull(dbSchema.courseCategories.parentId))
      .orderBy(
        dbSchema.courseCategories.name,
        pagination.orderBy === 'desc'
          ? desc(dbSchema.courseCategories.name)
          : asc(dbSchema.courseCategories.name),
      )
      .offset((pagination.page - 1) * pagination.pageSize)
      .limit(pagination.pageSize);

    const rawSql = sql`
      WITH RECURSIVE category_hierarchy AS (
            (${rootCategorySQL})
            UNION ALL
            (SELECT c.id,
                    c.name,
                    c.parent_id,
                    c.description,
                    ch.depth + 1
             FROM ${dbSchema.courseCategories} AS c
                      INNER JOIN
                  category_hierarchy AS ch ON c.parent_id = ch.id))
      SELECT *
      FROM category_hierarchy
      ORDER BY depth ASC;
  `;

    const result = await db.execute<{
      id: Uuid;
      name: string;
      parent_id: Uuid;
      description: string;
      depth: number;
    }>(rawSql);

    const map = new Map<string, ICourseCategoryWithRelations>();
    result.rows.forEach((row) => {
      const category: ICourseCategoryWithRelations =
        typia.assert<ICourseCategoryWithRelations>({
          id: row.id,
          name: row.name,
          parentId: row.parent_id,
          description: row.description,
          depth: row.depth,
          children: [],
        });
      map.set(category.id, category);
    });

    const rootCategories: ICourseCategoryWithRelations[] = [];
    map.forEach((category) => {
      if (category.parentId) {
        const parent = map.get(category.parentId);

        if (parent) {
          parent.children.push(category);
        }
      } else {
        rootCategories.push(category);
      }
    });

    return rootCategories;
  }
}
