import { DrizzleService } from '../../../../../src/infra/db/drizzle.service';
import { dbSchema } from '../../../../../src/infra/db/schema';
import { eq, isNull } from 'drizzle-orm';
import {
  ICategory,
  ICategoryWithRelations,
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
): Promise<ICategoryWithRelations[]> => {
  const categories = await drizzle.db.query.courseCategories.findMany({
    where: isNull(dbSchema.courseCategories.parentId),
    with: {
      parent: true,
      children: {
        with: {
          parent: true,
          children: {
            with: {
              parent: true,
              children: true,
            },
          },
        },
      },
    },
  });

  const roots: ICategoryWithRelations[] = categories.map((category) => {
    return {
      ...category,
      parent: null,
      children: [],
    } satisfies ICategoryWithRelations;
  });

  return roots;
};

export const findRootCategoryById = async (
  id: string,
  drizzle: DrizzleService,
): Promise<ICategoryWithRelations | null> => {
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
