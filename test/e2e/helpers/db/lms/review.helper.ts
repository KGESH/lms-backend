import { TransactionClient } from '../../../../../src/infra/db/drizzle.types';
import {
  IReview,
  IReviewCreate,
  IReviewWithRelations,
} from '../../../../../src/v1/review/review.interface';
import { dbSchema } from '../../../../../src/infra/db/schema';
import { createRandomCourse } from './course.helper';
import * as typia from 'typia';
import { seedCourseOrders } from './order.helper';

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
      parentId: parentReviewReply.id,
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
    },
  };
};

export const createRandomCourseReview = async (
  reviewCreateParams: IReviewCreate,
  db: TransactionClient,
): Promise<IReviewWithRelations> => {
  const { course } = await createRandomCourse(db);
  const review = await createReview(reviewCreateParams, db);
  const [courseReview] = await db
    .insert(dbSchema.courseReviews)
    .values({
      reviewId: review.id,
      courseId: course.id,
    })
    .returning();

  return review;
};

export const createManyReviews = async (
  params: IReviewCreate[],
  db: TransactionClient,
): Promise<IReview[]> => {
  const reviews = await db.insert(dbSchema.reviews).values(params).returning();
  return reviews;
};

export const seedCourseReviews = async (
  { count }: { count: number },
  db: TransactionClient,
): Promise<IReviewWithRelations[]> => {
  const orders = await seedCourseOrders({ count: 1 }, db);
  const reviews = (
    await Promise.all(
      Array.from({ length: count }).map(() =>
        Promise.all(
          orders.map((order) =>
            createRandomCourseReview(
              { ...typia.random<IReviewCreate>(), userId: order.order.userId },
              db,
            ),
          ),
        ),
      ),
    )
  ).flat();

  return reviews;
};
