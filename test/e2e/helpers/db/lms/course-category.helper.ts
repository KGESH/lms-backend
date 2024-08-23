import { dbSchema } from '../../../../../src/infra/db/schema';
import {
  ICourseCategory,
  ICourseCategoryCreate,
} from '@src/v1/course/category/course-category.interface';
import { TransactionClient } from '../../../../../src/infra/db/drizzle.types';

export const createCourseCategory = async (
  params: ICourseCategoryCreate,
  db: TransactionClient,
): Promise<ICourseCategory> => {
  const [category] = await db
    .insert(dbSchema.courseCategories)
    .values(params)
    .returning();

  return category;
};

export const createManyCourseCategories = async (
  createManyParams: ICourseCategoryCreate[],
  db: TransactionClient,
): Promise<ICourseCategory[]> => {
  const categories = await db
    .insert(dbSchema.courseCategories)
    .values(createManyParams)
    .returning();
  return categories;
};

export const seedCourseCategoriesWithChildren = async (
  { count }: { count: number },
  db: TransactionClient,
) => {
  const rootCreateParams = Array.from({ length: count }).map((_, index) => ({
    name: `root ${index} category`,
    description: null,
    parentId: null,
  }));

  const rootCategories = await createManyCourseCategories(rootCreateParams, db);

  const levelTwoCreateParams = rootCategories
    .map((root) =>
      Array.from({ length: count }).map((_, index) => ({
        name: `${root.name} child ${index}`,
        description: null,
        parentId: root.id,
      })),
    )
    .flat();

  const levelTwoCategories = await createManyCourseCategories(
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

  const levelThreeCategories = await createManyCourseCategories(
    levelThreeCreateParams,
    db,
  );

  return {
    rootCategories,
    levelTwoCategories,
    levelThreeCategories,
  };
};
