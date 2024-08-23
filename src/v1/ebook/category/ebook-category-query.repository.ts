import { Injectable, NotFoundException } from '@nestjs/common';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import {
  IEbookCategory,
  IEbookCategoryWithRelations,
} from '@src/v1/ebook/category/ebook-category.interface';
import { asc, desc, eq, isNull, sql } from 'drizzle-orm';
import { dbSchema } from '@src/infra/db/schema';
import { Pagination } from '@src/shared/types/pagination';
import { IEbook } from '@src/v1/ebook/ebook.interface';
import { TransactionClient } from '@src/infra/db/drizzle.types';
import { Uuid } from '@src/shared/types/primitive';
import * as typia from 'typia';

@Injectable()
export class EbookCategoryQueryRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async findEbookCategoryOrThrow(
    where: Pick<IEbookCategory, 'id'>,
  ): Promise<IEbookCategory> {
    const category = await this.findEbookCategory(where);

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  async findCategoryWithChildren(
    where: Pick<IEbookCategory, 'id'>,
  ): Promise<IEbookCategoryWithRelations | null> {
    const category = await this._getEbookCategoryWithChildrenRawSql(
      where,
      this.drizzle.db,
    );

    return category;
  }

  async findEbookCategoryWithChildrenOrThrow(
    where: Pick<IEbookCategory, 'id'>,
  ): Promise<IEbookCategoryWithRelations> {
    const category = await this.findCategoryWithChildren(where);

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  async findRootCategories(pagination: Pagination): Promise<IEbookCategory[]> {
    const roots = await this.drizzle.db.query.ebookCategories.findMany({
      where: isNull(dbSchema.ebookCategories.parentId),
      orderBy: (category, { asc }) => asc(category.name),
      offset: (pagination.page - 1) * pagination.pageSize,
      limit: pagination.pageSize,
    });

    return roots;
  }

  async findCategoryWithEbooks(
    where: Pick<IEbookCategory, 'id'>,
  ): Promise<(IEbookCategory & { ebooks: IEbook[] }) | null> {
    const category = await this.drizzle.db.query.ebookCategories.findFirst({
      where: eq(dbSchema.ebookCategories.id, where.id),
      with: {
        ebooks: true,
      },
    });

    if (!category) {
      return null;
    }

    return category;
  }

  async findRootCategoriesWithChildren(
    pagination: Pagination,
  ): Promise<IEbookCategoryWithRelations[]> {
    const rootCategories = await this._getRootEbookCategoriesRawSql(
      pagination,
      this.drizzle.db,
    );

    return rootCategories;
  }

  async findEbookCategory(
    where: Pick<IEbookCategory, 'id'>,
  ): Promise<IEbookCategory | null> {
    const category = await this.drizzle.db.query.ebookCategories.findFirst({
      where: eq(dbSchema.ebookCategories.id, where.id),
    });

    if (!category) {
      return null;
    }

    return category;
  }

  private async _getEbookCategoryWithChildrenRawSql(
    where: Pick<IEbookCategory, 'id'>,
    db: TransactionClient,
  ): Promise<IEbookCategoryWithRelations | null> {
    const categorySQL = db
      .select({
        id: dbSchema.ebookCategories.id,
        name: dbSchema.ebookCategories.name,
        parentId: dbSchema.ebookCategories.parentId,
        description: dbSchema.ebookCategories.description,
        depth: sql<number>`1`.as('depth'),
      })
      .from(dbSchema.ebookCategories)
      .where(eq(dbSchema.ebookCategories.id, where.id));

    const rawSql = sql`
      WITH RECURSIVE category_hierarchy AS (
            (${categorySQL})
            UNION ALL
            (SELECT c.id,
                    c.name,
                    c.parent_id,
                    c.description,
                    ch.depth + 1
             FROM ${dbSchema.ebookCategories} AS c
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
    const children: IEbookCategoryWithRelations[] = result.rows
      .slice(1)
      .map((row) => ({
        id: row.id,
        parentId: row.parent_id,
        name: row.name,
        description: row.description,
        depth: row.depth,
        parent: null,
        children: [],
      }));
    const rootCategory: IEbookCategoryWithRelations = {
      id: root.id,
      parentId: root.parent_id,
      name: root.name,
      description: root.description,
      depth: root.depth,
      children,
    };

    return rootCategory;
  }

  private async _getRootEbookCategoriesRawSql(
    pagination: Pagination,
    db: TransactionClient,
  ): Promise<IEbookCategoryWithRelations[]> {
    const rootCategorySQL = db
      .select({
        id: dbSchema.ebookCategories.id,
        name: dbSchema.ebookCategories.name,
        parentId: dbSchema.ebookCategories.parentId,
        description: dbSchema.ebookCategories.description,
        depth: sql<number>`1`.as('depth'),
      })
      .from(dbSchema.ebookCategories)
      .where(isNull(dbSchema.ebookCategories.parentId))
      .orderBy(
        dbSchema.ebookCategories.name,
        pagination.orderBy === 'desc'
          ? desc(dbSchema.ebookCategories.name)
          : asc(dbSchema.ebookCategories.name),
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
             FROM ${dbSchema.ebookCategories} AS c
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

    const map = new Map<string, IEbookCategoryWithRelations>();
    result.rows.forEach((row) => {
      const category: IEbookCategoryWithRelations =
        typia.assert<IEbookCategoryWithRelations>({
          id: row.id,
          name: row.name,
          parentId: row.parent_id,
          description: row.description,
          depth: row.depth,
          children: [],
        });
      map.set(category.id, category);
    });

    const rootCategories: IEbookCategoryWithRelations[] = [];
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
