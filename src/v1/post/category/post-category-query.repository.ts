import { Injectable, NotFoundException } from '@nestjs/common';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import {
  IPostCategory,
  IPostCategoryWithRelations,
} from '@src/v1/post/category/post-category.interface';
import { dbSchema } from '@src/infra/db/schema';
import { TransactionClient } from '@src/infra/db/drizzle.types';
import { asc, desc, eq, isNull, sql } from 'drizzle-orm';
import { Uuid } from '@src/shared/types/primitive';
import { Pagination } from '@src/shared/types/pagination';
import * as typia from 'typia';
import { IPostCategoryWithRoles } from '@src/v1/post/category/post-category-relations.interface';

@Injectable()
export class PostCategoryQueryRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async findPostCategory(
    where: Pick<IPostCategory, 'id'>,
  ): Promise<IPostCategory | null> {
    const category = await this._getPostCategoryWithChildrenRawSql(
      where,
      this.drizzle.db,
    );
    if (!category) {
      return null;
    }

    return category;
  }

  async findPostCategoryWithChildren(
    where: Pick<IPostCategory, 'id'>,
  ): Promise<IPostCategoryWithRelations | null> {
    const category = await this._getPostCategoryWithChildrenRawSql(
      where,
      this.drizzle.db,
    );

    return category;
  }

  async findPostCategoryWithChildrenOrThrow(
    where: Pick<IPostCategory, 'id'>,
  ): Promise<IPostCategoryWithRelations> {
    const category = await this.findPostCategoryWithChildren(where);

    if (!category) {
      throw new NotFoundException('PostCategory not found');
    }

    return category;
  }

  async findRootCategoriesWithRoles(
    pagination: Pagination,
  ): Promise<IPostCategoryWithRoles[]> {
    const roots = await this.drizzle.db.query.postCategories.findMany({
      where: isNull(dbSchema.postCategories.parentId),
      with: {
        readAccesses: true,
        writeAccesses: true,
      },
      orderBy: (category, { asc, desc }) =>
        pagination.orderBy === 'asc' ? asc(category.name) : desc(category.name),
      offset: (pagination.page - 1) * pagination.pageSize,
      limit: pagination.pageSize,
    });

    return roots.map((category) => ({
      ...category,
      readableRoles: category.readAccesses.map((access) => access.role),
      writableRoles: category.writeAccesses.map((access) => access.role),
    }));
  }

  async findRootCategoriesWithChildren(
    pagination: Pagination,
  ): Promise<IPostCategoryWithRelations[]> {
    return await this._getRootPostCategoriesRawSql(pagination, this.drizzle.db);
  }

  private async _getPostCategoryWithChildrenRawSql(
    where: Pick<IPostCategory, 'id'>,
    db: TransactionClient,
  ): Promise<IPostCategoryWithRelations | null> {
    const categorySQL = db
      .select({
        id: dbSchema.postCategories.id,
        name: dbSchema.postCategories.name,
        parentId: dbSchema.postCategories.parentId,
        description: dbSchema.postCategories.description,
        depth: sql<number>`1`.as('depth'),
      })
      .from(dbSchema.postCategories)
      .where(eq(dbSchema.postCategories.id, where.id));

    const rawSql = sql`
      WITH RECURSIVE category_hierarchy AS (
            (${categorySQL})
            UNION ALL
            (SELECT c.id,
                    c.name,
                    c.parent_id,
                    c.description,
                    ch.depth + 1
             FROM ${dbSchema.postCategories} AS c
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
    const children: IPostCategoryWithRelations[] = result.rows
      .slice(1)
      .map((row) => ({
        id: row.id,
        parentId: row.parent_id,
        name: row.name,
        description: row.description,
        depth: row.depth,
        children: [],
      }));
    const rootCategory: IPostCategoryWithRelations = {
      id: root.id,
      parentId: root.parent_id,
      name: root.name,
      description: root.description,
      depth: root.depth,
      children,
    };

    return rootCategory;
  }

  private async _getRootPostCategoriesRawSql(
    pagination: Pagination,
    db: TransactionClient,
  ): Promise<
    // {
    IPostCategoryWithRelations[]
    // roots: IPostCategoryWithRelations[];
    // everyCategories: IPostCategoryWithRelations[];
    // }
  > {
    const rootCategorySQL = db
      .select({
        id: dbSchema.postCategories.id,
        name: dbSchema.postCategories.name,
        parentId: dbSchema.postCategories.parentId,
        description: dbSchema.postCategories.description,
        depth: sql<number>`1`.as('depth'),
      })
      .from(dbSchema.postCategories)
      .where(isNull(dbSchema.postCategories.parentId))
      .orderBy(
        dbSchema.postCategories.name,
        pagination.orderBy === 'desc'
          ? desc(dbSchema.postCategories.name)
          : asc(dbSchema.postCategories.name),
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
             FROM ${dbSchema.postCategories} AS c
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

    const map = new Map<string, IPostCategoryWithRelations>();
    result.rows.forEach((row) => {
      const category: IPostCategoryWithRelations =
        typia.assert<IPostCategoryWithRelations>({
          id: row.id,
          name: row.name,
          parentId: row.parent_id,
          description: row.description,
          depth: row.depth,
          children: [],
        });
      map.set(category.id, category);
    });

    const rootCategories: IPostCategoryWithRelations[] = [];
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
