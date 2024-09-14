import { Injectable } from '@nestjs/common';
import { and, asc, desc, eq, isNull } from 'drizzle-orm';
import { dbSchema } from '@src/infra/db/schema';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import { IReview, IReviewWithRelations } from '@src/v1/review/review.interface';
import { Pagination } from '@src/shared/types/pagination';
import {
  IEbookReview,
  IEbookReviewRelationsCreate,
} from '@src/v1/review/ebook-review/ebook-review.interface';
import {
  ICourseReview,
  ICourseReviewRelationsCreate,
} from '@src/v1/review/course-review/course-review.interface';
import { Optional, OptionalPick } from '@src/shared/types/optional';

@Injectable()
export class ReviewQueryRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async findEbookReview(
    where: Pick<IEbookReview, 'ebookId'> & Pick<IReview, 'userId'>,
  ): Promise<{
    review: IReview;
    ebookReview: IEbookReview;
  } | null> {
    const [ebookReviewRelations] = await this.drizzle.db
      .select()
      .from(dbSchema.reviews)
      .where(
        and(
          eq(dbSchema.reviews.userId, where.userId),
          eq(dbSchema.ebookReviews.ebookId, where.ebookId),
          isNull(dbSchema.reviews.deletedAt),
        ),
      )
      .innerJoin(
        dbSchema.ebookReviews,
        eq(dbSchema.reviews.id, dbSchema.ebookReviews.reviewId),
      );

    if (!ebookReviewRelations) {
      return null;
    }

    const { ebook_reviews, reviews } = ebookReviewRelations;
    return {
      review: reviews,
      ebookReview: ebook_reviews,
    };
  }

  async findCourseReview(
    where: Pick<ICourseReview, 'courseId'> & Pick<IReview, 'userId'>,
  ): Promise<{
    review: IReview;
    courseReview: ICourseReview;
  } | null> {
    const [courseReviewRelations] = await this.drizzle.db
      .select()
      .from(dbSchema.reviews)
      .where(
        and(
          eq(dbSchema.reviews.userId, where.userId),
          eq(dbSchema.courseReviews.courseId, where.courseId),
          isNull(dbSchema.reviews.deletedAt),
        ),
      )
      .innerJoin(
        dbSchema.courseReviews,
        eq(dbSchema.reviews.id, dbSchema.courseReviews.reviewId),
      );

    if (!courseReviewRelations) {
      return null;
    }

    const { course_reviews, reviews } = courseReviewRelations;
    return {
      review: reviews,
      courseReview: course_reviews,
    };
  }

  async findCourseReviewWithReplies(
    where: Pick<IReview, 'id'>,
  ): Promise<IReviewWithRelations | null> {
    const review = await this.drizzle.db.query.reviews.findFirst({
      where: eq(dbSchema.reviews.id, where.id),
      with: {
        user: true,
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

    return {
      ...review,
      user: review.user,
      snapshot: review.snapshots[0],
      replies: review.replies.map((reply) => ({
        ...reply,
        snapshot: reply.snapshots[0],
      })),
      product: {
        ...review.courseReview.course,
        category: review.courseReview.course.category,
        teacher: review.courseReview.course.teacher,
      },
    };
  }

  async findEbookReviewWithReplies(
    where: Pick<IReview, 'id'>,
  ): Promise<IReviewWithRelations | null> {
    const review = await this.drizzle.db.query.reviews.findFirst({
      where: eq(dbSchema.reviews.id, where.id),
      with: {
        user: true,
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

    return {
      ...review,
      user: review.user,
      snapshot: review.snapshots[0],
      replies: review.replies.map((reply) => ({
        ...reply,
        snapshot: reply.snapshots[0],
      })),
      product: {
        ...review.ebookReview.ebook,
        category: review.ebookReview.ebook.category,
        teacher: review.ebookReview.ebook.teacher,
      },
    };
  }

  async findOneWithReplies(
    where: Pick<IReview, 'id' | 'productType'>,
  ): Promise<IReviewWithRelations | null> {
    if (where.productType === 'course') {
      return this.findCourseReviewWithReplies(where);
    } else {
      return this.findEbookReviewWithReplies(where);
    }
  }

  async findManyReviewsWithReplies(
    where: Optional<Pick<IReview, 'userId' | 'productType'>, 'userId'>,
    pagination: Pagination,
  ): Promise<IReviewWithRelations[]> {
    if (where.productType === 'course') {
      return await this.findManyWithCourseReviews({ where, pagination });
    } else {
      return await this.findManyWithEbookReviews({ where, pagination });
    }
  }

  async findManyWithCourseReviews({
    where,
    pagination,
  }: {
    where: OptionalPick<ICourseReviewRelationsCreate, 'courseId' | 'userId'>;
    pagination: Pagination;
  }): Promise<IReviewWithRelations[]> {
    const courseReviews = await this.drizzle.db.query.courseReviews.findMany({
      where: and(
        where.courseId
          ? eq(dbSchema.courseReviews.courseId, where.courseId)
          : undefined,
        where.userId ? eq(dbSchema.reviews.userId, where.userId) : undefined,
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
      user: courseReview.review.user,
      snapshot: courseReview.review.snapshots[0],
      replies: courseReview.review.replies.map((reply) => ({
        ...reply,
        snapshot: reply.snapshots[0],
      })),
      product: {
        ...courseReview.course,
        category: courseReview.course.category,
        teacher: courseReview.course.teacher,
      },
    }));
  }

  async findManyWithEbookReviews({
    where,
    pagination,
  }: {
    where: OptionalPick<IEbookReviewRelationsCreate, 'ebookId' | 'userId'>;
    pagination: Pagination;
  }): Promise<IReviewWithRelations[]> {
    const ebookReviews = await this.drizzle.db.query.ebookReviews.findMany({
      where: and(
        where.ebookId
          ? eq(dbSchema.ebookReviews.ebookId, where.ebookId)
          : undefined,
        where.userId ? eq(dbSchema.reviews.userId, where.userId) : undefined,
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
      user: ebookReview.review.user,
      snapshot: ebookReview.review.snapshots[0],
      replies: ebookReview.review.replies.map((reply) => ({
        ...reply,
        snapshot: reply.snapshots[0],
      })),
      product: {
        ...ebookReview.ebook,
        category: ebookReview.ebook.category,
        teacher: ebookReview.ebook.teacher,
      },
    }));
  }
}
