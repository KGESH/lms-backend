import { dbSchema } from '../../../../../src/infra/db/schema';
import { TransactionClient } from '../../../../../src/infra/db/drizzle.types';
import {
  IPostCategory,
  IPostCategoryCreate,
} from '../../../../../src/v1/post/category/post-category.interface';
import { IPostCategoryAccessRoles } from '../../../../../src/v1/post/category/access/post-category-access.interface';
import { OptionalPick } from '../../../../../src/shared/types/optional';
import { NAVBAR_CATEGORY } from '../../../../../src/core/navbar.constant';

export const createPostCategory = async (
  params: IPostCategoryCreate,
  createAccessRoleParams: Pick<
    IPostCategoryAccessRoles,
    'readableRoles' | 'writableRoles'
  >,
  db: TransactionClient,
): Promise<IPostCategory> => {
  const [category] = await db
    .insert(dbSchema.postCategories)
    .values(params)
    .returning();

  const readAccesses = await db
    .insert(dbSchema.postCategoryReadAccesses)
    .values(
      createAccessRoleParams.readableRoles.map((role) => ({
        categoryId: category.id,
        role,
      })),
    );

  const writeAccesses = await db
    .insert(dbSchema.postCategoryWriteAccesses)
    .values(
      createAccessRoleParams.writableRoles.map((role) => ({
        categoryId: category.id,
        role,
      })),
    );

  return category;
};

export const createManyPostCategories = async (
  createManyParams: IPostCategoryCreate[],
  createAccessRoleParams: Pick<
    IPostCategoryAccessRoles,
    'readableRoles' | 'writableRoles'
  >,
  db: TransactionClient,
): Promise<IPostCategory[]> => {
  const categories = await db
    .insert(dbSchema.postCategories)
    .values(createManyParams)
    .returning();

  const readAccesses = await db
    .insert(dbSchema.postCategoryReadAccesses)
    .values(
      categories
        .map((category) =>
          createAccessRoleParams.readableRoles.map((role) => ({
            categoryId: category.id,
            role,
          })),
        )
        .flat(),
    );

  const writeAccesses = await db
    .insert(dbSchema.postCategoryWriteAccesses)
    .values(
      categories
        .map((category) =>
          createAccessRoleParams.writableRoles.map((role) => ({
            categoryId: category.id,
            role,
          })),
        )
        .flat(),
    );

  return categories;
};

export const seedPostCategoriesWithChildren = async (
  params: { count: number } & OptionalPick<
    IPostCategoryAccessRoles,
    'readableRoles' | 'writableRoles'
  >,
  db: TransactionClient,
) => {
  const readableRoles = params.readableRoles ?? ['guest'];
  const writableRoles = params.writableRoles ?? [
    'admin',
    'manager',
    'teacher',
    'user',
  ];

  const rootCreateParams = Array.from({ length: params.count }).map(
    (_, index) => ({
      name: `root ${index} category`,
      description: null,
      parentId: null,
    }),
  );

  const rootCategories = await createManyPostCategories(
    rootCreateParams,
    { readableRoles, writableRoles },
    db,
  );

  const levelTwoCreateParams = rootCategories
    .map((root) =>
      Array.from({ length: params.count }).map((_, index) => ({
        name: `${root.name} child ${index}`,
        description: null,
        parentId: root.id,
      })),
    )
    .flat();

  const levelTwoCategories = await createManyPostCategories(
    levelTwoCreateParams,
    { readableRoles, writableRoles },
    db,
  );

  const levelThreeCreateParams = levelTwoCategories
    .map((levelTwo) =>
      Array.from({ length: params.count }).map((_, index) => ({
        name: `${levelTwo.name} child ${index}`,
        description: null,
        parentId: levelTwo.id,
      })),
    )
    .flat();

  const levelThreeCategories = await createManyPostCategories(
    levelThreeCreateParams,
    { readableRoles, writableRoles },
    db,
  );

  return {
    rootCategories,
    levelTwoCategories,
    levelThreeCategories,
  };
};

/**
 * 홈 페이지 네비게이션바 카테고리를 생성합니다.
 */
export const seedNavbarCategories = async (db: TransactionClient) => {
  const announcementCategory = await createPostCategory(
    {
      name: NAVBAR_CATEGORY.ANNOUNCEMENT.name,
      description: '공지사항 카테고리',
      parentId: null,
    },
    {
      readableRoles: ['guest'],
      writableRoles: ['admin', 'manager'],
    },
    db,
  );

  const columnCategory = await createPostCategory(
    {
      name: NAVBAR_CATEGORY.COLUMN.name,
      description: '칼럼 카테고리',
      parentId: null,
    },
    {
      readableRoles: ['guest'],
      writableRoles: ['admin', 'manager'],
    },
    db,
  );

  const faqCategory = await createPostCategory(
    {
      name: NAVBAR_CATEGORY.FAQ.name,
      description: 'FAQ 카테고리',
      parentId: null,
    },
    {
      readableRoles: ['guest'],
      writableRoles: ['admin', 'manager'],
    },
    db,
  );

  return {
    announcementCategory,
    columnCategory,
    faqCategory,
  };
};

/**
 * 커뮤니티 최상위 카테고리를 생성합니다.
 */
export const seedRootCommunityCategory = async (db: TransactionClient) => {
  const communityCategory = await createPostCategory(
    {
      name: '커뮤니티',
      description: '커뮤니티 카테고리',
      parentId: null,
    },
    {
      readableRoles: ['guest'],
      writableRoles: ['admin', 'manager', 'teacher', 'user'],
    },
    db,
  );

  return communityCategory;
};

/**
 * 커뮤니티 카테고리 목록을 생성합니다.
 */
export const seedCommunityCategories = async (db: TransactionClient) => {
  const communityRootCategory = await seedRootCommunityCategory(db);

  const [freeCategory] = await createManyPostCategories(
    [
      {
        name: '자유게시판',
        description: '자유게시판 카테고리',
        parentId: communityRootCategory.id,
      },
    ],
    {
      readableRoles: ['guest'],
      writableRoles: ['admin', 'manager', 'teacher', 'user'],
    },
    db,
  );

  // Profit Certification
  const [profitCertificationCategory] = await createManyPostCategories(
    [
      {
        name: '수익인증',
        description: '수익인증 카테고리',
        parentId: communityRootCategory.id,
      },
    ],
    {
      readableRoles: ['guest'],
      writableRoles: ['admin', 'manager', 'teacher', 'user'],
    },
    db,
  );

  // Discussion
  const [discussionCategory] = await createManyPostCategories(
    [
      {
        name: '토론',
        description: '토론 카테고리',
        parentId: communityRootCategory.id,
      },
    ],
    {
      readableRoles: ['guest'],
      writableRoles: ['admin', 'manager', 'teacher', 'user'],
    },
    db,
  );

  return {
    communityRootCategory,
    freeCategory,
    profitCertificationCategory,
    discussionCategory,
  };
};
