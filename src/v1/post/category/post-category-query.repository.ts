import { Injectable, NotFoundException } from '@nestjs/common';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import {
  IPostCategory,
  IPostCategoryWithRelations,
} from '@src/v1/post/category/post-category.interface';
import { dbSchema } from '@src/infra/db/schema';
import { TransactionClient } from '@src/infra/db/drizzle.types';
import { asc, desc, eq, inArray, isNull, sql } from 'drizzle-orm';
import { CategoryAccessRole, Uuid } from '@src/shared/types/primitive';
import { Pagination } from '@src/shared/types/pagination';
import * as typia from 'typia';
import {
  IPostCategoryRelationsWithRoles,
  IPostCategoryWithRoles,
} from '@src/v1/post/category/post-category-relations.interface';
import { NAVBAR_CATEGORY } from '@src/core/navbar.constant';

@Injectable()
export class PostCategoryQueryRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async findNavbarCategories() {
    const navbarCategoryNames = [
      NAVBAR_CATEGORY.ANNOUNCEMENT.name,
      NAVBAR_CATEGORY.FAQ.name,
      NAVBAR_CATEGORY.COLUMN.name,
    ];

    const navbarCategories =
      await this.drizzle.db.query.postCategories.findMany({
        where: inArray(dbSchema.postCategories.name, navbarCategoryNames),
      });

    return navbarCategories;
  }

  async findPostCategory(
    where: Pick<IPostCategory, 'id'>,
  ): Promise<IPostCategoryRelationsWithRoles | null> {
    return await this._getPostCategoryWithChildrenRawSql(
      where,
      this.drizzle.db,
    );
  }

  async findPostCategoryWithChildren(
    where: Pick<IPostCategory, 'id'>,
  ): Promise<IPostCategoryRelationsWithRoles | null> {
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
  ): Promise<IPostCategoryRelationsWithRoles[]> {
    return await this._getRootPostCategoriesRawSql(pagination, this.drizzle.db);
  }

  private async _getPostCategoryWithChildrenRawSql(
    where: Pick<IPostCategory, 'id'>,
    db: TransactionClient,
  ): Promise<IPostCategoryRelationsWithRoles | null> {
    // Base SQL for the category and its children
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

    // Recursive SQL to gather category hierarchy and access roles
    const rawSql = sql`
    WITH RECURSIVE category_hierarchy AS (
      (${categorySQL})
      UNION ALL
      SELECT c.id,
             c.name,
             c.parent_id,
             c.description,
             ch.depth + 1
      FROM ${dbSchema.postCategories} AS c
      INNER JOIN category_hierarchy AS ch ON c.parent_id = ch.id
    ),
    category_access AS (
      SELECT 
        pc.id AS category_id,
        ARRAY_AGG(DISTINCT ra.role) FILTER (WHERE ra.role IS NOT NULL) AS readable_roles,
        ARRAY_AGG(DISTINCT wa.role) FILTER (WHERE wa.role IS NOT NULL) AS writable_roles
      FROM ${dbSchema.postCategories} AS pc
      LEFT JOIN ${dbSchema.postCategoryReadAccesses} AS ra ON pc.id = ra.category_id
      LEFT JOIN ${dbSchema.postCategoryWriteAccesses} AS wa ON pc.id = wa.category_id
      GROUP BY pc.id
    )
    SELECT ch.*, ca.readable_roles, ca.writable_roles
    FROM category_hierarchy AS ch
    LEFT JOIN category_access AS ca ON ch.id = ca.category_id
    ORDER BY ch.depth ASC;
  `;

    const result = await db.execute<{
      id: Uuid;
      name: string;
      parent_id: Uuid | null;
      description: string | null;
      depth: number;
      readable_roles: string | null; // Postgres array type. Need to convert to JS array
      writable_roles: string | null; // Postgres array type. Need to convert to JS array
    }>(rawSql);

    // Handle the case where no rows are returned
    if (!result.rows[0]) {
      return null;
    }

    // Transform R/W roles from string to array
    const rows = result.rows.map((row) => ({
      ...row,
      readable_roles: typia.assert<CategoryAccessRole[]>(
        row.readable_roles?.replace(/[{}]/g, '').split(',') ?? [],
      ),
      writable_roles: typia.assert<CategoryAccessRole[]>(
        row.writable_roles?.replace(/[{}]/g, '').split(',') ?? [],
      ),
    }));

    // First row is the root category (order by depth asc)
    const root = rows[0];
    const rootCategory: IPostCategoryRelationsWithRoles = {
      id: root.id,
      parentId: root.parent_id,
      name: root.name,
      description: root.description,
      depth: root.depth,
      readableRoles: root.readable_roles,
      writableRoles: root.writable_roles,
      children: [],
    };

    // Build the hierarchy for child categories
    const map = new Map<string, IPostCategoryRelationsWithRoles>();
    rows.forEach((row) => {
      const category: IPostCategoryRelationsWithRoles = {
        id: row.id,
        name: row.name,
        parentId: row.parent_id,
        description: row.description,
        depth: row.depth,
        readableRoles: row.readable_roles,
        writableRoles: row.writable_roles,
        children: [],
      };
      map.set(category.id, category);
    });

    // Attach children to their respective parents
    map.forEach((category) => {
      if (category.parentId) {
        const parent = map.get(category.parentId);
        if (parent) {
          parent.children.push(category);
        }
      }
    });

    // Return the root category with all its children
    const rootWithChildren = map.get(rootCategory.id)!;
    return rootWithChildren;
  }

  private async _getRootPostCategoriesRawSql(
    pagination: Pagination,
    db: TransactionClient,
  ): Promise<IPostCategoryRelationsWithRoles[]> {
    // Base SQL for root categories
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

    // Recursive SQL query to gather categories and access roles
    const rawSql = sql`
    WITH RECURSIVE category_hierarchy AS (
      (${rootCategorySQL})
      UNION ALL
      SELECT c.id,
             c.name,
             c.parent_id,
             c.description,
             ch.depth + 1
      FROM ${dbSchema.postCategories} AS c
      INNER JOIN category_hierarchy AS ch ON c.parent_id = ch.id
    ),
    category_access AS (
      SELECT 
        pc.id AS category_id,
        ARRAY_AGG(DISTINCT ra.role) FILTER (WHERE ra.role IS NOT NULL) AS readable_roles,
        ARRAY_AGG(DISTINCT wa.role) FILTER (WHERE wa.role IS NOT NULL) AS writable_roles
      FROM ${dbSchema.postCategories} AS pc
      LEFT JOIN ${dbSchema.postCategoryReadAccesses} AS ra ON pc.id = ra.category_id
      LEFT JOIN ${dbSchema.postCategoryWriteAccesses} AS wa ON pc.id = wa.category_id
      GROUP BY pc.id
    )
    SELECT ch.*, ca.readable_roles, ca.writable_roles
    FROM category_hierarchy AS ch
    LEFT JOIN category_access AS ca ON ch.id = ca.category_id
    ORDER BY ch.depth ASC;
  `;

    const result = await db.execute<{
      id: Uuid;
      name: string;
      parent_id: Uuid | null;
      description: string | null;
      depth: number;
      readable_roles: string | null; // Postgres array type. Need to convert to JS array
      writable_roles: string | null; // Postgres array type. Need to convert to JS array
    }>(rawSql);

    // Transform R/W roles from string to array
    const rows = result.rows.map((row) => ({
      ...row,
      readable_roles: typia.assert<CategoryAccessRole[]>(
        row.readable_roles?.replace(/[{}]/g, '').split(',') ?? [],
      ),
      writable_roles: typia.assert<CategoryAccessRole[]>(
        row.writable_roles?.replace(/[{}]/g, '').split(',') ?? [],
      ),
    }));

    const map = new Map<string, IPostCategoryRelationsWithRoles>();
    rows.forEach((row) => {
      const category: IPostCategoryRelationsWithRoles = {
        id: row.id,
        name: row.name,
        parentId: row.parent_id,
        description: row.description,
        depth: row.depth,
        readableRoles: row.readable_roles,
        writableRoles: row.writable_roles,
        children: [],
      };
      map.set(category.id, category);
    });

    // Build children, parent tree
    const rootCategories: IPostCategoryRelationsWithRoles[] = [];
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
