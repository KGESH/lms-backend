import { Injectable } from '@nestjs/common';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import { asc, desc, eq, isNull } from 'drizzle-orm';
import { dbSchema } from '@src/infra/db/schema';
import { IMockReview } from '@src/v1/review/mock-review/mock-review.interface';
import { IReviewWithRelations } from '@src/v1/review/review.interface';

@Injectable()
export class MockReviewQueryRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async findMockReview(where: {
    reviewId: IMockReview['review']['id'];
    productType: IMockReview['review']['productType'];
  }): Promise<IReviewWithRelations | null> {
    if (where.productType === 'course') {
      return await this.findMockCourseReview(where);
    } else {
      return await this.findMockEbookReview(where);
    }
  }

  async findMockEbookReview(where: {
    reviewId: IMockReview['review']['id'];
  }): Promise<IReviewWithRelations | null> {
    const mockReviewUser = await this.drizzle.db.query.mockReviewUsers.findFirst(
      {
        where: eq(dbSchema.mockReviewUsers.reviewId, where.reviewId),
        with: {
          review: {
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
      },
    );

    if (!mockReviewUser?.review?.ebookReview) {
      return null;
    }

    return {
      ...mockReviewUser.review,
      user: {
        ...mockReviewUser,
        emailVerified: null,
        role: 'user',
      },
      snapshot: mockReviewUser.review.snapshots[0],
      replies: mockReviewUser.review.replies.map((reply) => ({
        ...reply,
        snapshot: reply.snapshots[0],
      })),
      product: {
        ...mockReviewUser.review.ebookReview.ebook,
        category: mockReviewUser.review.ebookReview.ebook.category,
        teacher: mockReviewUser.review.ebookReview.ebook.teacher,
      },
    };
  }

  async findMockCourseReview(where: {
    reviewId: IMockReview['review']['id'];
  }): Promise<IReviewWithRelations | null> {
    const mockReviewUser = await this.drizzle.db.query.mockReviewUsers.findFirst(
      {
        where: eq(dbSchema.mockReviewUsers.reviewId, where.reviewId),
        with: {
          review: {
            with: {
              courseReview: {
                with: {
                  course: {
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
      },
    );

    if (!mockReviewUser?.review?.courseReview) {
      return null;
    }

    return {
      ...mockReviewUser.review,
      user: {
        ...mockReviewUser,
        emailVerified: null,
        role: 'user',
      },
      snapshot: mockReviewUser.review.snapshots[0],
      replies: mockReviewUser.review.replies.map((reply) => ({
        ...reply,
        snapshot: reply.snapshots[0],
      })),
      product: {
        ...mockReviewUser.review.courseReview.course,
        category: mockReviewUser.review.courseReview.course.category,
        teacher: mockReviewUser.review.courseReview.course.teacher,
      },
    };
  }
}
