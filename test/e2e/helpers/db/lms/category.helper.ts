import { dbSchema } from '../../../../../src/infra/db/schema';
import { eq, isNull } from 'drizzle-orm';
import {
  ICategory,
  ICategoryWithChildren,
  ICategoryCreate,
} from '../../../../../src/v1/category/category.interface';
import { TransactionClient } from '../../../../../src/infra/db/drizzle.types';

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
  const categories = await db.query.courseCategories.findMany({
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

  const roots: ICategoryWithChildren[] = categories;
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
