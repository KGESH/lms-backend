import { Injectable } from '@nestjs/common';
import { and, asc, desc, eq, isNull, inArray } from 'drizzle-orm';
import { dbSchema } from '@src/infra/db/schema';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import {
  IReview,
  IReviewReplyWithRelations,
  IReviewWithRelations,
} from '@src/v1/review/review.interface';
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
import { alias } from 'drizzle-orm/pg-core';

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

    return {
      ...review,
      user: review.user,
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

    return {
      ...review,
      user: review.user,
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
    const { db } = this.drizzle;
    // Alias the users table for the teacher's account
    const teacherAccountAlias = alias(dbSchema.users, 'teacherAccount');

    const latestReviewSnapshotSQL = db
      .select({ id: dbSchema.reviewSnapshots.id })
      .from(dbSchema.reviewSnapshots)
      .where(eq(dbSchema.reviewSnapshots.reviewId, dbSchema.reviews.id))
      .orderBy(desc(dbSchema.reviewSnapshots.createdAt))
      .limit(1);

    // Fetch the main data
    const courseReviews = await db
      .select({
        review: dbSchema.reviews,
        user: dbSchema.users, // Reviewer
        courseReview: dbSchema.courseReviews,
        course: dbSchema.courses,
        category: dbSchema.courseCategories,
        teacher: dbSchema.teachers,
        teacherAccount: teacherAccountAlias,
        latestSnapshot: dbSchema.reviewSnapshots,
      })
      .from(dbSchema.courseReviews)
      .innerJoin(
        dbSchema.reviews,
        eq(dbSchema.courseReviews.reviewId, dbSchema.reviews.id),
      )
      .innerJoin(
        dbSchema.reviewSnapshots,
        eq(dbSchema.reviewSnapshots.id, latestReviewSnapshotSQL),
      )
      .innerJoin(
        dbSchema.users, // Reviewer
        eq(dbSchema.reviews.userId, dbSchema.users.id),
      )
      .innerJoin(
        dbSchema.courses,
        eq(dbSchema.courseReviews.courseId, dbSchema.courses.id),
      )
      .innerJoin(
        dbSchema.courseCategories,
        eq(dbSchema.courses.categoryId, dbSchema.courseCategories.id),
      )
      .innerJoin(
        dbSchema.teachers,
        eq(dbSchema.courses.teacherId, dbSchema.teachers.id),
      )
      .innerJoin(
        teacherAccountAlias,
        eq(dbSchema.teachers.userId, teacherAccountAlias.id),
      )
      .where(
        and(
          where.courseId
            ? eq(dbSchema.courseReviews.courseId, where.courseId)
            : undefined,
          where.userId ? eq(dbSchema.reviews.userId, where.userId) : undefined,
          isNull(dbSchema.reviews.orderId), // Mock review filter
          isNull(dbSchema.reviews.deletedAt),
        ),
      )
      .orderBy(
        pagination.orderBy === 'asc'
          ? asc(dbSchema.reviews.createdAt)
          : desc(dbSchema.reviews.createdAt),
      )
      .offset((pagination.page - 1) * pagination.pageSize)
      .limit(pagination.pageSize);

    const latestReplySnapshotSQL = db
      .select({ id: dbSchema.reviewReplySnapshots.id })
      .from(dbSchema.reviewReplySnapshots)
      .where(
        eq(
          dbSchema.reviewReplySnapshots.reviewReplyId,
          dbSchema.reviewReplies.id,
        ),
      )
      .orderBy(desc(dbSchema.reviewReplySnapshots.createdAt))
      .limit(1);

    // Collect all review IDs
    const reviewIds = courseReviews.map((result) => result.review.id);
    const replyUserAlias = alias(dbSchema.users, 'replyUser');
    // Fetch all replies for these reviews
    const replies = await db
      .select({
        reply: dbSchema.reviewReplies,
        user: replyUserAlias,
        latestReplySnapshot: dbSchema.reviewReplySnapshots,
      })
      .from(dbSchema.reviewReplies)
      .innerJoin(
        replyUserAlias,
        eq(dbSchema.reviewReplies.userId, replyUserAlias.id),
      )
      .innerJoin(
        dbSchema.reviewReplySnapshots,
        eq(dbSchema.reviewReplySnapshots.id, latestReplySnapshotSQL),
      )
      .where(
        and(
          inArray(dbSchema.reviewReplies.reviewId, reviewIds),
          isNull(dbSchema.reviewReplies.deletedAt),
        ),
      );

    // Group replies by reviewId
    const repliesByReviewId = new Map<string, IReviewReplyWithRelations[]>();
    for (const replyRelations of replies) {
      const { reviewId } = replyRelations.reply;
      if (!repliesByReviewId.has(reviewId)) {
        repliesByReviewId.set(reviewId, []);
      }
      repliesByReviewId.get(reviewId)!.push({
        ...replyRelations.reply,
        user: replyRelations.user,
        snapshot: replyRelations.latestReplySnapshot,
      });
    }

    // Assemble the final results
    const reviewsWithRelations: IReviewWithRelations[] = [];

    courseReviews.forEach((reviewRelations) => {
      const {
        review,
        latestSnapshot,
        user,
        course,
        category,
        teacher,
        teacherAccount,
      } = reviewRelations;

      const repliesWithSnapshots: IReviewReplyWithRelations[] =
        repliesByReviewId.get(review.id) ?? [];

      reviewsWithRelations.push({
        ...review,
        user,
        snapshot: latestSnapshot,
        replies: repliesWithSnapshots,
        product: {
          ...course,
          category,
          teacher: { ...teacher, account: teacherAccount },
        },
      } satisfies IReviewWithRelations);
    });

    return reviewsWithRelations;
  }

  async findManyWithEbookReviews({
    where,
    pagination,
  }: {
    where: OptionalPick<IEbookReviewRelationsCreate, 'ebookId' | 'userId'>;
    pagination: Pagination;
  }): Promise<IReviewWithRelations[]> {
    const { db } = this.drizzle;

    // Alias the users table for the teacher's account
    const teacherAccountAlias = alias(dbSchema.users, 'teacherAccount');

    const latestReviewSnapshotSQL = db
      .select({ id: dbSchema.reviewSnapshots.id })
      .from(dbSchema.reviewSnapshots)
      .where(eq(dbSchema.reviewSnapshots.reviewId, dbSchema.reviews.id))
      .orderBy(desc(dbSchema.reviewSnapshots.createdAt))
      .limit(1);

    const ebookReviews = await db
      .select({
        review: dbSchema.reviews,
        user: dbSchema.users, // Reviewer
        ebookReview: dbSchema.ebookReviews,
        ebook: dbSchema.ebooks,
        category: dbSchema.ebookCategories,
        teacher: dbSchema.teachers,
        teacherAccount: teacherAccountAlias,
        latestSnapshot: dbSchema.reviewSnapshots,
      })
      .from(dbSchema.ebookReviews)
      .innerJoin(
        dbSchema.reviews,
        eq(dbSchema.ebookReviews.reviewId, dbSchema.reviews.id),
      )
      .innerJoin(
        dbSchema.reviewSnapshots,
        eq(dbSchema.reviewSnapshots.id, latestReviewSnapshotSQL),
      )
      .innerJoin(
        dbSchema.users, // Reviewer
        eq(dbSchema.reviews.userId, dbSchema.users.id),
      )
      .innerJoin(
        dbSchema.ebooks,
        eq(dbSchema.ebookReviews.ebookId, dbSchema.ebooks.id),
      )
      .innerJoin(
        dbSchema.ebookCategories,
        eq(dbSchema.ebooks.categoryId, dbSchema.ebookCategories.id),
      )
      .innerJoin(
        dbSchema.teachers,
        eq(dbSchema.ebooks.teacherId, dbSchema.teachers.id),
      )
      .innerJoin(
        teacherAccountAlias,
        eq(dbSchema.teachers.userId, teacherAccountAlias.id),
      )
      .where(
        and(
          where.ebookId
            ? eq(dbSchema.ebookReviews.ebookId, where.ebookId)
            : undefined,
          where.userId ? eq(dbSchema.reviews.userId, where.userId) : undefined,
          isNull(dbSchema.reviews.deletedAt),
        ),
      )
      .orderBy(
        pagination.orderBy === 'asc'
          ? asc(dbSchema.reviews.createdAt)
          : desc(dbSchema.reviews.createdAt),
      )
      .offset((pagination.page - 1) * pagination.pageSize)
      .limit(pagination.pageSize);

    const latestReplySnapshotSQL = db
      .select({ id: dbSchema.reviewReplySnapshots.id })
      .from(dbSchema.reviewReplySnapshots)
      .where(
        eq(
          dbSchema.reviewReplySnapshots.reviewReplyId,
          dbSchema.reviewReplies.id,
        ),
      )
      .orderBy(desc(dbSchema.reviewReplySnapshots.createdAt))
      .limit(1);

    // Collect all review IDs
    const reviewIds = ebookReviews.map((result) => result.review.id);
    const replyUserAlias = alias(dbSchema.users, 'replyUser');
    // Fetch all replies for these reviews
    const replies = await db
      .select({
        reply: dbSchema.reviewReplies,
        user: replyUserAlias,
        latestReplySnapshot: dbSchema.reviewReplySnapshots,
      })
      .from(dbSchema.reviewReplies)
      .innerJoin(
        replyUserAlias,
        eq(dbSchema.reviewReplies.userId, replyUserAlias.id),
      )
      .innerJoin(
        dbSchema.reviewReplySnapshots,
        eq(dbSchema.reviewReplySnapshots.id, latestReplySnapshotSQL),
      )
      .where(
        and(
          inArray(dbSchema.reviewReplies.reviewId, reviewIds),
          isNull(dbSchema.reviewReplies.deletedAt),
        ),
      );

    // Group replies by reviewId
    const repliesByReviewId = new Map<string, IReviewReplyWithRelations[]>();
    for (const replyRelations of replies) {
      const { reviewId } = replyRelations.reply;
      if (!repliesByReviewId.has(reviewId)) {
        repliesByReviewId.set(reviewId, []);
      }
      repliesByReviewId.get(reviewId)!.push({
        ...replyRelations.reply,
        user: replyRelations.user,
        snapshot: replyRelations.latestReplySnapshot,
      });
    }

    // Assemble the final results
    const reviewsWithRelations: IReviewWithRelations[] = [];

    ebookReviews.forEach((reviewRelations) => {
      const {
        review,
        latestSnapshot,
        user,
        ebook,
        category,
        teacher,
        teacherAccount,
      } = reviewRelations;

      const repliesWithSnapshots: IReviewReplyWithRelations[] =
        repliesByReviewId.get(review.id) ?? [];

      reviewsWithRelations.push({
        ...review,
        user,
        snapshot: latestSnapshot,
        replies: repliesWithSnapshots,
        product: {
          ...ebook,
          category,
          teacher: { ...teacher, account: teacherAccount },
        },
      } satisfies IReviewWithRelations);
    });

    return reviewsWithRelations;
  }
}
