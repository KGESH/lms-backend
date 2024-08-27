import { Injectable } from '@nestjs/common';
import { and, asc, desc, eq, isNull } from 'drizzle-orm';
import { dbSchema } from '@src/infra/db/schema';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import { IReview, IReviewWithRelations } from '@src/v1/review/review.interface';
import { Pagination } from '@src/shared/types/pagination';
import { IEbookReviewRelationsCreate } from '@src/v1/review/ebook-review/ebook-review.interface';
import { ICourseReviewRelationsCreate } from '@src/v1/review/course-review/course-review.interface';

@Injectable()
export class ReviewQueryRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async findOneWithReplies(
    where: Pick<IReview, 'id' | 'productType'>,
  ): Promise<IReviewWithRelations | null> {
    const review = await this.drizzle.db.query.reviews.findFirst({
      where: eq(dbSchema.reviews.id, where.id),
      with: {
        replies: {
          where: isNull(dbSchema.reviewReplies.deletedAt),
          orderBy: asc(dbSchema.reviewReplies.createdAt),
          with: {
            snapshots: {
              orderBy: desc(dbSchema.reviewReplySnapshots.createdAt),
              limit: 1,
            },
          },
        },
        snapshots: {
          orderBy: desc(dbSchema.reviewSnapshots.createdAt),
          limit: 1,
        },
      },
    });

    if (!review) {
      return null;
    }

    return {
      ...review,
      snapshot: review.snapshots[0],
      replies: review.replies.map((reply) => ({
        ...reply,
        snapshot: reply.snapshots[0],
      })),
    };
  }

  async findManyWithReplies(
    where: Pick<IReview, 'productType'>,
    pagination: Pagination,
  ): Promise<IReviewWithRelations[]> {
    const reviews =
      where.productType === 'course'
        ? await this.findManyWithCourseReviews({ pagination })
        : await this.findManyWithEbookReviews({ pagination });

    return reviews;
  }

  async findManyWithCourseReviews({
    where,
    pagination,
  }: {
    where?: Pick<ICourseReviewRelationsCreate, 'courseId'>;
    pagination: Pagination;
  }): Promise<IReviewWithRelations[]> {
    const courseReviews = await this.drizzle.db.query.courseReviews.findMany({
      where: where
        ? and(
            eq(dbSchema.courseReviews.courseId, where.courseId),
            isNull(dbSchema.courseReviews.deletedAt),
          )
        : isNull(dbSchema.courseReviews.deletedAt),
      orderBy: (courseReviews, { asc, desc }) =>
        pagination.orderBy === 'asc'
          ? asc(courseReviews.createdAt)
          : desc(courseReviews.createdAt),
      limit: pagination.pageSize,
      offset: (pagination.page - 1) * pagination.pageSize,
      with: {
        review: {
          with: {
            snapshots: {
              orderBy: desc(dbSchema.reviewSnapshots.createdAt),
              limit: 1,
            },
            replies: {
              where: isNull(dbSchema.reviewReplies.deletedAt),
              orderBy: asc(dbSchema.reviewReplies.createdAt),
              with: {
                snapshots: {
                  orderBy: desc(dbSchema.reviewReplySnapshots.createdAt),
                  limit: 1,
                },
              },
            },
          },
        },
      },
    });

    return courseReviews.map((courseReview) => ({
      ...courseReview.review,
      snapshot: courseReview.review.snapshots[0],
      replies: courseReview.review.replies.map((reply) => ({
        ...reply,
        snapshot: reply.snapshots[0],
      })),
    }));
  }

  async findManyWithEbookReviews({
    where,
    pagination,
  }: {
    where?: Pick<IEbookReviewRelationsCreate, 'ebookId'>;
    pagination: Pagination;
  }): Promise<IReviewWithRelations[]> {
    const ebookReviews = await this.drizzle.db.query.ebookReviews.findMany({
      where: where
        ? and(
            eq(dbSchema.ebookReviews.ebookId, where.ebookId),
            isNull(dbSchema.ebookReviews.deletedAt),
          )
        : isNull(dbSchema.ebookReviews.deletedAt),
      orderBy: (ebookReviews, { asc, desc }) =>
        pagination.orderBy === 'asc'
          ? asc(ebookReviews.createdAt)
          : desc(ebookReviews.createdAt),
      limit: pagination.pageSize,
      offset: (pagination.page - 1) * pagination.pageSize,
      with: {
        review: {
          with: {
            snapshots: {
              orderBy: desc(dbSchema.reviewSnapshots.createdAt),
              limit: 1,
            },
            replies: {
              where: isNull(dbSchema.reviewReplies.deletedAt),
              orderBy: asc(dbSchema.reviewReplies.createdAt),
              with: {
                snapshots: {
                  orderBy: desc(dbSchema.reviewReplySnapshots.createdAt),
                  limit: 1,
                },
              },
            },
          },
        },
      },
    });

    return ebookReviews.map((ebookReview) => ({
      ...ebookReview.review,
      snapshot: ebookReview.review.snapshots[0],
      replies: ebookReview.review.replies.map((reply) => ({
        ...reply,
        snapshot: reply.snapshots[0],
      })),
    }));
  }
}
