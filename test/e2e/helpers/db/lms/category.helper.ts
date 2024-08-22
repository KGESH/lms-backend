import { dbSchema } from '../../../../../src/infra/db/schema';
import { asc, desc, eq, isNull, sql } from 'drizzle-orm';
import {
  ICategory,
  ICategoryCreate,
  ICategoryWithChildren,
  ICategoryWithRelations,
} from '../../../../../src/v1/category/category.interface';
import { TransactionClient } from '../../../../../src/infra/db/drizzle.types';
import { Pagination } from '../../../../../src/shared/types/pagination';
import { courseCategories } from '../../../../../src/infra/db/schema/course';
import { Uuid } from '../../../../../src/shared/types/primitive';
import * as typia from 'typia';
import { DEFAULT_PAGINATION } from '../../../../../src/core/pagination.constant';

export const findCategory = async (
  where: Pick<ICategory, 'id'>,
  db: TransactionClient,
): Promise<ICategory | null> => {
  const category = await db.query.courseCategories.findFirst({
    where: eq(dbSchema.courseCategories.id, where.id),
  });
  return category ?? null;
};

export const findRootCategories = async (
  db: TransactionClient,
): Promise<ICategoryWithChildren[]> => {
  const roots: ICategoryWithChildren[] = await getRootCategoriesRawSql(
    DEFAULT_PAGINATION,
    db,
  );

  return roots;
};

export const findRootCategoryById = async (
  id: string,
  db: TransactionClient,
): Promise<ICategoryWithChildren | null> => {
  const rootCategory = await findRootCategories(db);
  return rootCategory.find((category) => category.id === id) ?? null;
};

export const createCategory = async (
  params: ICategoryCreate,
  db: TransactionClient,
): Promise<ICategory> => {
  const [category] = await db
    .insert(dbSchema.courseCategories)
    .values(params)
    .returning();

  return category;
};

export const createManyCategories = async (
  createManyParams: ICategoryCreate[],
  db: TransactionClient,
): Promise<ICategory[]> => {
  const categories = await db
    .insert(dbSchema.courseCategories)
    .values(createManyParams)
    .returning();
  return categories;
};

export const getRootCategoriesRawSql = async (
  pagination: Pagination,
  db: TransactionClient,
): Promise<ICategoryWithRelations[]> => {
  const rootCategorySQL = db
    .select({
      id: courseCategories.id,
      name: courseCategories.name,
      parentId: courseCategories.parentId,
      description: courseCategories.description,
      depth: sql<number>`1`.as('depth'),
    })
    .from(courseCategories)
    .where(isNull(courseCategories.parentId))
    .orderBy(
      courseCategories.name,
      pagination.orderBy === 'desc'
        ? desc(courseCategories.name)
        : asc(courseCategories.name),
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
         FROM ${courseCategories} AS c
                  INNER JOIN
              category_hierarchy AS ch ON c.parent_id = ch.id)
      )
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

  const map = new Map<string, ICategoryWithRelations>();
  result.rows.forEach((row) => {
    const category: ICategoryWithRelations =
      typia.assert<ICategoryWithRelations>({
        id: row.id,
        name: row.name,
        parentId: row.parent_id,
        description: row.description,
        depth: row.depth,
        parent: null,
        children: [],
      });
    map.set(category.id, category);
  });

  const rootCategories: ICategoryWithRelations[] = [];
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
};

export const getCategoryWithChildrenRawSql = async (
  where: Pick<ICategory, 'id'>,
  db: TransactionClient,
): Promise<ICategoryWithRelations | null> => {
  const categorySQL = db
    .select({
      id: courseCategories.id,
      name: courseCategories.name,
      parentId: courseCategories.parentId,
      description: courseCategories.description,
      depth: sql<number>`1`.as('depth'),
    })
    .from(courseCategories)
    .where(eq(courseCategories.id, where.id));

  const rawSql = sql`
      WITH RECURSIVE category_hierarchy AS (
        (${categorySQL})
        UNION ALL
        (SELECT c.id,
                c.name,
                c.parent_id,
                c.description,
                ch.depth + 1
         FROM ${courseCategories} AS c
                  INNER JOIN
              category_hierarchy AS ch ON c.parent_id = ch.id)
      )
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

  const map = new Map<string, ICategoryWithRelations>();
  result.rows.forEach((row) => {
    const category: ICategoryWithRelations =
      typia.assert<ICategoryWithRelations>({
        id: row.id,
        name: row.name,
        parentId: row.parent_id,
        description: row.description,
        depth: row.depth,
        parent: null,
        children: [],
      });
    map.set(category.id, category);
  });

  const rootCategories: ICategoryWithRelations[] = [];
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

  return rootCategories[0] ?? null;
};

export const seedCategoriesWithChildren = async (
  { count }: { count: number },
  db: TransactionClient,
) => {
  const rootCreateParams = Array.from({ length: count }).map((_, index) => ({
    name: `root ${index} category`,
    description: null,
    parentId: null,
  }));

  const rootCategories = await createManyCategories(rootCreateParams, db);

  const levelTwoCreateParams = rootCategories
    .map((root) =>
      Array.from({ length: count }).map((_, index) => ({
        name: `${root.name} child ${index}`,
        description: null,
        parentId: root.id,
      })),
    )
    .flat();

  const levelTwoCategories = await createManyCategories(
    levelTwoCreateParams,
    db,
  );

  const levelThreeCreateParams = levelTwoCategories
    .map((levelTwo) =>
      Array.from({ length: count }).map((_, index) => ({
        name: `${levelTwo.name} child ${index}`,
        description: null,
        parentId: levelTwo.id,
      })),
    )
    .flat();

  const levelThreeCategories = await createManyCategories(
    levelThreeCreateParams,
    db,
  );

  return {
    rootCategories,
    levelTwoCategories,
    levelThreeCategories,
  };
};
