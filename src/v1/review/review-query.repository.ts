import { Injectable } from '@nestjs/common';
import { DrizzleService } from '../../infra/db/drizzle.service';
import { IReview, IReviewWithRelations } from './review.interface';
import { asc, desc, eq, isNull } from 'drizzle-orm';
import { dbSchema } from '../../infra/db/schema';
import { Pagination } from '../../shared/types/pagination';

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
      snapshot: {
        ...review.snapshots[0],
        replies: review.replies.map((reply) => ({
          ...reply,
          snapshot: reply.snapshots[0],
        })),
      },
    };
  }

  async findManyWithReplies(
    where: Pick<IReview, 'productType'>,
    pagination: Pagination,
  ): Promise<IReviewWithRelations[]> {
    const reviews =
      where.productType === 'course'
        ? await this.findManyWithCourseReviews(pagination)
        : await this.findManyWithEbookReviews(pagination);

    return reviews;
  }

  async findManyWithCourseReviews(
    pagination: Pagination,
  ): Promise<IReviewWithRelations[]> {
    const reviews = await this.drizzle.db.query.reviews.findMany({
      orderBy: (reviews, { desc }) => desc(reviews.createdAt),
      limit: pagination.pageSize,
      offset: (pagination.page - 1) * pagination.pageSize,
      with: {
        courseReview: {
          with: {
            course: true,
          },
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
        snapshots: {
          orderBy: desc(dbSchema.reviewSnapshots.createdAt),
          limit: 1,
        },
      },
    });

    return reviews.map((review) => ({
      ...review,
      snapshot: {
        ...review.snapshots[0],
        replies: review.replies.map((reply) => ({
          ...reply,
          snapshot: reply.snapshots[0],
        })),
      },
    }));
  }

  async findManyWithEbookReviews(
    pagination: Pagination,
  ): Promise<IReviewWithRelations[]> {
    const reviews = await this.drizzle.db.query.reviews.findMany({
      orderBy: (reviews, { desc }) => desc(reviews.createdAt),
      limit: pagination.pageSize,
      offset: (pagination.page - 1) * pagination.pageSize,
      with: {
        ebookReview: true,
        // Todo: Impl
        // {
        // with: {
        //   ebook: true,
        // },
        // },
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

    return reviews.map((review) => ({
      ...review,
      snapshot: {
        ...review.snapshots[0],
        replies: review.replies.map((reply) => ({
          ...reply,
          snapshot: reply.snapshots[0],
        })),
      },
    }));
  }
}
