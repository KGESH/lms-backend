import { TransactionClient } from '../../../../../src/infra/db/drizzle.types';
import {
  IReviewCreate,
  IReviewReply,
  IReviewReplyCreate,
  IReviewReplySnapshotCreate,
  IReviewReplyWithRelations,
  IReviewWithRelations,
} from '../../../../../src/v1/review/review.interface';
import { dbSchema } from '../../../../../src/infra/db/schema';
import { createRandomCourse } from './course.helper';
import { seedCourseOrders, seedEbookOrders } from './order.helper';
import { createRandomEbook } from './ebook.helper';
import { Uuid } from '../../../../../src/shared/types/primitive';
import { and, desc, eq, isNull } from 'drizzle-orm';
import { IUserWithoutPassword } from '../../../../../src/v1/user/user.interface';
import {
  IMockReviewUser,
  IMockReviewUserCreate,
} from '../../../../../src/v1/review/mock-review/mock-review-user.interface';

export const createMockReviewUser = async (
  params: IMockReviewUserCreate,
  db: TransactionClient,
): Promise<IMockReviewUser> => {
  const [mockReviewUser] = await db
    .insert(dbSchema.mockReviewUsers)
    .values(params)
    .returning();
  return mockReviewUser;
};

export const createMockEbookReview = async (
  params: Omit<IReviewCreate, 'userId'> & {
    ebookId?: Uuid;
    adminUser: IUserWithoutPassword;
    mockReviewUser: Omit<IMockReviewUserCreate, 'reviewId'>;
  },
  db: TransactionClient,
): Promise<Omit<IReviewWithRelations, 'product'>> => {
  const reviewRelations = await createRandomEbookReview(
    {
      ...params,
      reviewer: params.adminUser,
    },
    db,
  );

  const mockReviewUser = await createMockReviewUser(
    {
      displayName: params.mockReviewUser.displayName,
      email: params.mockReviewUser.email,
      image: params.mockReviewUser.image,
      reviewId: reviewRelations.id,
    },
    db,
  );

  return {
    ...reviewRelations,
    user: mockReviewUser,
  };
};

export const createMockCourseReview = async (
  params: Omit<IReviewCreate, 'userId'> & {
    courseId?: Uuid;
    adminUser: IUserWithoutPassword;
    mockReviewUser: Omit<IMockReviewUserCreate, 'reviewId'>;
  },
  db: TransactionClient,
): Promise<Omit<IReviewWithRelations, 'product'>> => {
  const reviewRelations = await createRandomCourseReview(
    {
      ...params,
      reviewer: params.adminUser,
    },
    db,
  );

  const mockReviewUser = await createMockReviewUser(
    {
      displayName: params.mockReviewUser.displayName,
      email: params.mockReviewUser.email,
      image: params.mockReviewUser.image,
      reviewId: reviewRelations.id,
    },
    db,
  );

  return {
    ...reviewRelations,
    user: mockReviewUser,
  };
};

export const createReview = async (
  params: Omit<IReviewCreate, 'userId'> & { reviewer: IUserWithoutPassword },
  db: TransactionClient,
): Promise<Omit<IReviewWithRelations, 'product'>> => {
  const { reviewer, ...rest } = params;
  const createReviewParams: IReviewCreate = {
    ...rest,
    userId: reviewer.id,
  };
  const [review] = await db
    .insert(dbSchema.reviews)
    .values(createReviewParams)
    .returning();
  const [reviewSnapshot] = await db
    .insert(dbSchema.reviewSnapshots)
    .values({
      reviewId: review.id,
      comment: 'Mock review',
      rating: 5,
    })
    .returning();
  const [parentReviewReply] = await db
    .insert(dbSchema.reviewReplies)
    .values({
      userId: params.reviewer.id,
      reviewId: review.id,
    })
    .returning();
  const [childReviewReply] = await db
    .insert(dbSchema.reviewReplies)
    .values({
      userId: params.reviewer.id,
      reviewId: review.id,
    })
    .returning();
  const [parentReviewReplySnapshot] = await db
    .insert(dbSchema.reviewReplySnapshots)
    .values({
      comment: 'parent review comment',
      reviewReplyId: parentReviewReply.id,
    })
    .returning();
  const [childReviewReplySnapshot] = await db
    .insert(dbSchema.reviewReplySnapshots)
    .values({
      comment: 'child review comment',
      reviewReplyId: childReviewReply.id,
    })
    .returning();

  return {
    ...review,
    user: params.reviewer,
    snapshot: {
      ...reviewSnapshot,
    },
    replies: [
      {
        ...parentReviewReply,
        user: params.reviewer,
        snapshot: parentReviewReplySnapshot,
      },
      {
        ...childReviewReply,
        user: params.reviewer,
        snapshot: childReviewReplySnapshot,
      },
    ],
  };
};

export const createRandomCourseReview = async (
  reviewCreateParams: Omit<IReviewCreate, 'userId'> & {
    courseId?: Uuid;
    reviewer: IUserWithoutPassword;
  },
  db: TransactionClient,
): Promise<Omit<IReviewWithRelations, 'product'>> => {
  const courseId =
    reviewCreateParams?.courseId ?? (await createRandomCourse(db)).course.id;
  const review = await createReview(reviewCreateParams, db);
  const [courseReview] = await db
    .insert(dbSchema.courseReviews)
    .values({
      reviewId: review.id,
      courseId,
    })
    .returning();

  return review;
};

export const createRandomEbookReview = async (
  reviewCreateParams: Omit<IReviewCreate, 'userId'> & {
    ebookId?: Uuid;
    reviewer: IUserWithoutPassword;
  },
  db: TransactionClient,
): Promise<Omit<IReviewWithRelations, 'product'>> => {
  const ebookId =
    reviewCreateParams?.ebookId ?? (await createRandomEbook(db)).ebook.id;
  const review = await createReview(reviewCreateParams, db);
  const [ebookReview] = await db
    .insert(dbSchema.ebookReviews)
    .values({
      reviewId: review.id,
      ebookId,
    })
    .returning();

  return review;
};

export const createReviewReply = async (
  params: IReviewReplyCreate,
  db: TransactionClient,
): Promise<IReviewReply> => {
  const [reply] = await db
    .insert(dbSchema.reviewReplies)
    .values(params)
    .returning();
  return reply;
};

export const createReviewReplySnapshot = async (
  params: IReviewReplySnapshotCreate,
  db: TransactionClient,
) => {
  const [snapshot] = await db
    .insert(dbSchema.reviewReplySnapshots)
    .values(params)
    .returning();
  return snapshot;
};

export const findReviewRepliesByReviewId = async (
  where: Pick<IReviewReply, 'reviewId'>,
  db: TransactionClient,
): Promise<IReviewReplyWithRelations[]> => {
  const repliesWithLatestSnapshot = await db.query.reviewReplies.findMany({
    where: and(
      eq(dbSchema.reviewReplies.reviewId, where.reviewId),
      isNull(dbSchema.reviewReplies.deletedAt),
    ),
    with: {
      user: true,
      snapshots: {
        orderBy: desc(dbSchema.reviewReplySnapshots.createdAt),
        limit: 1,
      },
    },
  });

  return repliesWithLatestSnapshot.map((reply) => ({
    ...reply,
    user: reply.user,
    snapshot: reply.snapshots[0],
  }));
};

export const seedCourseReviews = async (
  { count }: { count: number },
  db: TransactionClient,
): Promise<Omit<IReviewWithRelations, 'product'>[]> => {
  const orders = await seedCourseOrders({ count: 1 }, db);

  const reviews = (
    await Promise.all(
      Array.from({ length: count }).map(() =>
        Promise.all(
          orders.map(({ user, order, product }) =>
            createRandomCourseReview(
              {
                courseId: product.courseId,
                orderId: order.id,
                reviewer: user,
                productType: order.productType,
              },
              db,
            ),
          ),
        ),
      ),
    )
  ).flat();

  return reviews;
};

export const seedMockCourseReviews = async (
  {
    courseId,
    adminUser,
    mockReviewUsers,
  }: {
    courseId?: Uuid;
    adminUser: IUserWithoutPassword;
    mockReviewUsers: Omit<IMockReviewUserCreate, 'reviewId'>[];
  },
  db: TransactionClient,
) => {
  if (mockReviewUsers.length === 0) {
    throw new Error('mockReviewUsers must have at least one user');
  }

  const reviews = await Promise.all(
    mockReviewUsers.map((mockReviewUser) =>
      createMockCourseReview(
        {
          courseId,
          adminUser,
          mockReviewUser,
          orderId: null,
          productType: 'course',
        },
        db,
      ),
    ),
  );

  return reviews;
};

export const seedMockEbookReviews = async (
  {
    ebookId,
    adminUser,
    mockReviewUsers,
  }: {
    ebookId?: Uuid;
    adminUser: IUserWithoutPassword;
    mockReviewUsers: Omit<IMockReviewUserCreate, 'reviewId'>[];
  },
  db: TransactionClient,
) => {
  if (mockReviewUsers.length === 0) {
    throw new Error('mockReviewUsers must have at least one user');
  }

  const reviews = await Promise.all(
    mockReviewUsers.map((mockReviewUser) =>
      createMockEbookReview(
        {
          ebookId,
          adminUser,
          mockReviewUser,
          orderId: null,
          productType: 'ebook',
        },
        db,
      ),
    ),
  );

  return reviews;
};

export const seedEbookReviews = async (
  { count }: { count: number },
  db: TransactionClient,
): Promise<Omit<IReviewWithRelations, 'product'>[]> => {
  const orders = await seedEbookOrders({ count: 1 }, db);
  const reviews = (
    await Promise.all(
      Array.from({ length: count }).map(() =>
        Promise.all(
          orders.map(({ user, order, product }) =>
            createRandomEbookReview(
              {
                ebookId: product.ebookId,
                orderId: order.id,
                reviewer: user,
                productType: order.productType,
              },
              db,
            ),
          ),
        ),
      ),
    )
  ).flat();

  return reviews;
};
