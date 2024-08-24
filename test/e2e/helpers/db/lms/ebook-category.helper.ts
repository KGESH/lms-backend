import { dbSchema } from '../../../../../src/infra/db/schema';
import { TransactionClient } from '../../../../../src/infra/db/drizzle.types';
import {
  IEbookCategory,
  IEbookCategoryCreate,
} from '../../../../../src/v1/ebook/category/ebook-category.interface';

export const createEbookCategory = async (
  params: IEbookCategoryCreate,
  db: TransactionClient,
): Promise<IEbookCategory> => {
  const [category] = await db
    .insert(dbSchema.ebookCategories)
    .values(params)
    .returning();

  return category;
};

export const createManyEbookCategories = async (
  createManyParams: IEbookCategoryCreate[],
  db: TransactionClient,
): Promise<IEbookCategory[]> => {
  const categories = await db
    .insert(dbSchema.ebookCategories)
    .values(createManyParams)
    .returning();
  return categories;
};

export const seedEbookCategoriesWithChildren = async (
  { count }: { count: number },
  db: TransactionClient,
) => {
  const rootCreateParams = Array.from({ length: count }).map((_, index) => ({
    name: `root ${index} category`,
    description: null,
    parentId: null,
  }));

  const rootCategories = await createManyEbookCategories(rootCreateParams, db);

  const levelTwoCreateParams = rootCategories
    .map((root) =>
      Array.from({ length: count }).map((_, index) => ({
        name: `${root.name} child ${index}`,
        description: null,
        parentId: root.id,
      })),
    )
    .flat();

  const levelTwoCategories = await createManyEbookCategories(
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

  const levelThreeCategories = await createManyEbookCategories(
    levelThreeCreateParams,
    db,
  );

  return {
    rootCategories,
    levelTwoCategories,
    levelThreeCategories,
  };
};
