import { TransactionClient } from '../../../../../src/infra/db/drizzle.types';
import {
  IReviewCreate,
  IReviewReply,
  IReviewReplyCreate,
  IReviewReplySnapshotCreate,
  IReviewReplyWithSnapshot,
  IReviewWithRelations,
} from '../../../../../src/v1/review/review.interface';
import { dbSchema } from '../../../../../src/infra/db/schema';
import { createRandomCourse } from './course.helper';
import { seedCourseOrders, seedEbookOrders } from './order.helper';
import { createRandomEbook } from './ebook.helper';
import { Uuid } from '@src/shared/types/primitive';
import { and, desc, eq, isNull } from 'drizzle-orm';

export const createReview = async (
  params: IReviewCreate,
  db: TransactionClient,
): Promise<IReviewWithRelations> => {
  const [review] = await db.insert(dbSchema.reviews).values(params).returning();
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
      userId: params.userId,
      reviewId: review.id,
    })
    .returning();
  const [childReviewReply] = await db
    .insert(dbSchema.reviewReplies)
    .values({
      userId: params.userId,
      reviewId: review.id,
      // parentId: parentReviewReply.id,
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
    snapshot: {
      ...reviewSnapshot,
    },
    replies: [
      {
        ...parentReviewReply,
        snapshot: parentReviewReplySnapshot,
      },
      {
        ...childReviewReply,
        snapshot: childReviewReplySnapshot,
      },
    ],
  };
};

export const createRandomCourseReview = async (
  reviewCreateParams: IReviewCreate & {
    courseId?: Uuid;
  },
  db: TransactionClient,
): Promise<IReviewWithRelations> => {
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
  reviewCreateParams: IReviewCreate & {
    ebookId?: Uuid;
  },
  db: TransactionClient,
): Promise<IReviewWithRelations> => {
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
): Promise<IReviewReplyWithSnapshot[]> => {
  const repliesWithLatestSnapshot = await db.query.reviewReplies.findMany({
    where: and(
      eq(dbSchema.reviewReplies.reviewId, where.reviewId),
      isNull(dbSchema.reviewReplies.deletedAt),
    ),
    with: {
      snapshots: {
        orderBy: desc(dbSchema.reviewReplySnapshots.createdAt),
        limit: 1,
      },
    },
  });

  return repliesWithLatestSnapshot.map((reply) => ({
    ...reply,
    snapshot: reply.snapshots[0],
  }));
};

export const seedCourseReviews = async (
  { count, replyCount }: { count: number; replyCount?: number },
  db: TransactionClient,
): Promise<IReviewWithRelations[]> => {
  const orders = await seedCourseOrders({ count: 1 }, db);
  const reviews = (
    await Promise.all(
      Array.from({ length: count }).map(() =>
        Promise.all(
          orders.map(({ order, product }) =>
            createRandomCourseReview(
              {
                courseId: product.courseId,
                orderId: order.id,
                userId: order.userId,
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

export const seedEbookReviews = async (
  { count }: { count: number },
  db: TransactionClient,
): Promise<IReviewWithRelations[]> => {
  const orders = await seedEbookOrders({ count: 1 }, db);
  const reviews = (
    await Promise.all(
      Array.from({ length: count }).map(() =>
        Promise.all(
          orders.map(({ order, product }) =>
            createRandomEbookReview(
              {
                ebookId: product.ebookId,
                orderId: order.id,
                userId: order.userId,
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
