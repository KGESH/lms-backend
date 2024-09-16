import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import { IReview, IReviewWithRelations } from '@src/v1/review/review.interface';
import { and, asc, desc, eq, isNull } from 'drizzle-orm';
import { dbSchema } from '@src/infra/db/schema';
import { Uuid } from '@src/shared/types/primitive';
import { Pagination } from '@src/shared/types/pagination';

@Injectable()
export class MockEbookReviewQueryRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async findManyMockEbookReviews(
    where: { ebookId?: Uuid },
    pagination: Pagination,
  ): Promise<IReviewWithRelations[]> {
    const ebookReviews = await this.drizzle.db.query.ebookReviews.findMany({
      where: and(
        where.ebookId
          ? eq(dbSchema.ebookReviews.ebookId, where.ebookId)
          : undefined,
        isNull(dbSchema.ebookReviews.deletedAt),
      ),
      orderBy: (ebookReviews, { asc, desc }) =>
        pagination.orderBy === 'asc'
          ? asc(ebookReviews.createdAt)
          : desc(ebookReviews.createdAt),
      limit: pagination.pageSize,
      offset: (pagination.page - 1) * pagination.pageSize,
      with: {
        ebook: {
          with: {
            category: true,
            teacher: {
              with: {
                account: true,
              },
            },
          },
        },
        review: {
          with: {
            user: true,
            mockUser: true,
            snapshots: {
              orderBy: desc(dbSchema.reviewSnapshots.createdAt),
              limit: 1,
            },
            replies: {
              where: isNull(dbSchema.reviewReplies.deletedAt),
              orderBy: asc(dbSchema.reviewReplies.createdAt),
              with: {
                user: true,
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
      user: ebookReview.review.mockUser ?? ebookReview.review.user,
      snapshot: ebookReview.review.snapshots[0],
      replies: ebookReview.review.replies.map((reply) => ({
        ...reply,
        user: reply.user,
        snapshot: reply.snapshots[0],
      })),
      product: {
        ...ebookReview.ebook,
        category: ebookReview.ebook.category,
        teacher: ebookReview.ebook.teacher,
      },
    }));
  }

  async findMockEbookReview(
    where: Pick<IReview, 'id'>,
  ): Promise<IReviewWithRelations | null> {
    const review = await this.drizzle.db.query.reviews.findFirst({
      where: eq(dbSchema.reviews.id, where.id),
      with: {
        ebookReview: {
          with: {
            ebook: {
              with: {
                category: true,
                teacher: {
                  with: {
                    account: true,
                  },
                },
              },
            },
          },
        },
        replies: {
          where: isNull(dbSchema.reviewReplies.deletedAt),
          orderBy: asc(dbSchema.reviewReplies.createdAt),
          with: {
            user: true,
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

    if (!review?.ebookReview) {
      return null;
    }

    const mockUser = await this.drizzle.db.query.mockReviewUsers.findFirst({
      where: eq(dbSchema.mockReviewUsers.reviewId, review.id),
    });

    if (!mockUser) {
      throw new InternalServerErrorException('Mock user not found');
    }

    return {
      ...review,
      user: mockUser,
      snapshot: review.snapshots[0],
      replies: review.replies.map((reply) => ({
        ...reply,
        user: reply.user,
        snapshot: reply.snapshots[0],
      })),
      product: {
        ...review.ebookReview.ebook,
        category: review.ebookReview.ebook.category,
        teacher: review.ebookReview.ebook.teacher,
      },
    };
  }
}
