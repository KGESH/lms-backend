import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import { IReview, IReviewWithRelations } from '@src/v1/review/review.interface';
import { and, asc, desc, eq, isNull } from 'drizzle-orm';
import { dbSchema } from '@src/infra/db/schema';
import { Uuid } from '@src/shared/types/primitive';
import { Pagination } from '@src/shared/types/pagination';

@Injectable()
export class MockCourseReviewQueryRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async findManyMockCourseReviews(
    where: { courseId?: Uuid },
    pagination: Pagination,
  ): Promise<IReviewWithRelations[]> {
    const courseReviews = await this.drizzle.db.query.courseReviews.findMany({
      where: and(
        where.courseId
          ? eq(dbSchema.courseReviews.courseId, where.courseId)
          : undefined,
        isNull(dbSchema.courseReviews.deletedAt),
      ),
      orderBy: (courseReviews, { asc, desc }) =>
        pagination.orderBy === 'asc'
          ? asc(courseReviews.createdAt)
          : desc(courseReviews.createdAt),
      limit: pagination.pageSize,
      offset: (pagination.page - 1) * pagination.pageSize,
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

    return courseReviews.map((courseReview) => ({
      ...courseReview.review,
      user: courseReview.review.mockUser ?? courseReview.review.user,
      snapshot: courseReview.review.snapshots[0],
      replies: courseReview.review.replies.map((reply) => ({
        ...reply,
        user: reply.user,
        snapshot: reply.snapshots[0],
      })),
      product: {
        ...courseReview.course,
        category: courseReview.course.category,
        teacher: courseReview.course.teacher,
      },
    }));
  }

  async findMockCourseReview(
    where: Pick<IReview, 'id'>,
  ): Promise<IReviewWithRelations | null> {
    const review = await this.drizzle.db.query.reviews.findFirst({
      where: eq(dbSchema.reviews.id, where.id),
      with: {
        mockUser: true,
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

    if (!review?.courseReview) {
      return null;
    }

    if (!review.mockUser) {
      throw new InternalServerErrorException('Mock user not found');
    }

    return {
      ...review,
      user: review.mockUser,
      snapshot: review.snapshots[0],
      replies: review.replies.map((reply) => ({
        ...reply,
        user: reply.user,
        snapshot: reply.snapshots[0],
      })),
      product: {
        ...review.courseReview.course,
        category: review.courseReview.course.category,
        teacher: review.courseReview.course.teacher,
      },
    };
  }
}
