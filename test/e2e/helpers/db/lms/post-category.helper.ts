import { dbSchema } from '../../../../../src/infra/db/schema';
import { TransactionClient } from '../../../../../src/infra/db/drizzle.types';
import {
  IPostCategory,
  IPostCategoryCreate,
} from '../../../../../src/v1/post/category/post-category.interface';

export const createPostCategory = async (
  params: IPostCategoryCreate,
  db: TransactionClient,
): Promise<IPostCategory> => {
  const [category] = await db
    .insert(dbSchema.postCategories)
    .values(params)
    .returning();

  return category;
};

export const createManyPostCategories = async (
  createManyParams: IPostCategoryCreate[],
  db: TransactionClient,
): Promise<IPostCategory[]> => {
  const categories = await db
    .insert(dbSchema.postCategories)
    .values(createManyParams)
    .returning();
  return categories;
};

export const seedPostCategoriesWithChildren = async (
  { count }: { count: number },
  db: TransactionClient,
) => {
  const rootCreateParams = Array.from({ length: count }).map((_, index) => ({
    name: `root ${index} category`,
    description: null,
    parentId: null,
  }));

  const rootCategories = await createManyPostCategories(rootCreateParams, db);

  const levelTwoCreateParams = rootCategories
    .map((root) =>
      Array.from({ length: count }).map((_, index) => ({
        name: `${root.name} child ${index}`,
        description: null,
        parentId: root.id,
      })),
    )
    .flat();

  const levelTwoCategories = await createManyPostCategories(
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

  const levelThreeCategories = await createManyPostCategories(
    levelThreeCreateParams,
    db,
  );

  return {
    rootCategories,
    levelTwoCategories,
    levelThreeCategories,
  };
};
