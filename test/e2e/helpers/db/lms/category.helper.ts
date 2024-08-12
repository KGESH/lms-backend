import { DrizzleService } from '../../../../../src/infra/db/drizzle.service';
import { dbSchema } from '../../../../../src/infra/db/schema';
import { eq, isNull } from 'drizzle-orm';
import {
  ICategory,
  ICategoryWithChildren,
  ICategoryCreate,
} from '../../../../../src/v1/category/category.interface';

export const findCategory = async (
  where: Pick<ICategory, 'id'>,
  drizzle: DrizzleService,
): Promise<ICategory | null> => {
  const category = await drizzle.db.query.courseCategories.findFirst({
    where: eq(dbSchema.courseCategories.id, where.id),
  });
  return category ?? null;
};

export const findRootCategories = async (
  drizzle: DrizzleService,
): Promise<ICategoryWithChildren[]> => {
  const categories = await drizzle.db.query.courseCategories.findMany({
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
  drizzle: DrizzleService,
): Promise<ICategoryWithChildren | null> => {
  const rootCategory = await findRootCategories(drizzle);
  return rootCategory.find((category) => category.id === id) ?? null;
};

export const createCategory = async (
  params: ICategoryCreate,
  drizzle: DrizzleService,
): Promise<ICategory> => {
  const [category] = await drizzle.db
    .insert(dbSchema.courseCategories)
    .values(params)
    .returning();

  return category;
};

export const createManyCategories = async (
  createManyParams: ICategoryCreate[],
  drizzle: DrizzleService,
): Promise<ICategory[]> => {
  const categories = await drizzle.db
    .insert(dbSchema.courseCategories)
    .values(createManyParams)
    .returning();
  return categories;
};
