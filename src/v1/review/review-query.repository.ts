import { Injectable } from '@nestjs/common';
import {
  and,
  asc,
  count,
  desc,
  eq,
  inArray,
  isNotNull,
  isNull,
  or,
} from 'drizzle-orm';
import { dbSchema } from '@src/infra/db/schema';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import {
  IReview,
  IReviewReplyWithRelations,
  IReviewWithRelations,
} from '@src/v1/review/review.interface';
import { Paginated, Pagination } from '@src/shared/types/pagination';
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

  async findAllProductReviewWithReplies(
    where: OptionalPick<IReview, 'userId'>,
    pagination: Pagination,
  ): Promise<Paginated<IReviewWithRelations[]>> {
    return await this.findEveryProductsReviewsWithReplies({
      where,
      pagination,
    });
  }

  async findManyReviewsWithReplies(
    where: Optional<Pick<IReview, 'userId' | 'productType'>, 'userId'>,
    pagination: Pagination,
  ): Promise<Paginated<IReviewWithRelations[]>> {
    if (where.productType === 'course') {
      return await this.findManyWithCourseReviews({ where, pagination });
    } else {
      return await this.findManyWithEbookReviews({ where, pagination });
    }
  }

  async findEveryProductsReviewsWithReplies({
    where,
    pagination,
  }: {
    where?: Optional<Pick<IReview, 'userId'>, 'userId'>;
    pagination: Pagination;
  }): Promise<Paginated<IReviewWithRelations[]>> {
    const { reviewsWithRelations, totalCount } =
      await this.drizzle.db.transaction(async (tx) => {
        // Alias for teacher account
        const teacherAccountAlias = alias(dbSchema.users, 'teacherAccount');

        // Subquery to get the latest review snapshot per review
        const latestReviewSnapshotAlias = alias(
          dbSchema.reviewSnapshots,
          'latestSnapshot',
        );
        const latestReviewSnapshotSubquery = tx
          .select({ id: dbSchema.reviewSnapshots.id })
          .from(dbSchema.reviewSnapshots)
          .where(eq(dbSchema.reviewSnapshots.reviewId, dbSchema.reviews.id))
          .orderBy(desc(dbSchema.reviewSnapshots.createdAt))
          .limit(1);

        // Subquery to get the latest reply snapshot per reply
        const latestReplySnapshotAlias = alias(
          dbSchema.reviewReplySnapshots,
          'latestReplySnapshot',
        );
        const latestReplySnapshotSubquery = tx
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

        // Fetch paginated reviews with joins
        const reviewsData = await tx
          .select({
            review: dbSchema.reviews,
            user: dbSchema.users,
            latestSnapshot: latestReviewSnapshotAlias,
            courseReview: dbSchema.courseReviews,
            ebookReview: dbSchema.ebookReviews,
            course: dbSchema.courses,
            ebook: dbSchema.ebooks,
            courseCategory: dbSchema.courseCategories,
            ebookCategory: dbSchema.ebookCategories,
            teacher: dbSchema.teachers,
            teacherAccount: teacherAccountAlias,
          })
          .from(dbSchema.reviews)
          .innerJoin(
            dbSchema.users,
            eq(dbSchema.reviews.userId, dbSchema.users.id),
          )
          .leftJoin(
            dbSchema.courseReviews,
            eq(dbSchema.reviews.id, dbSchema.courseReviews.reviewId),
          )
          .leftJoin(
            dbSchema.ebookReviews,
            eq(dbSchema.reviews.id, dbSchema.ebookReviews.reviewId),
          )
          // Left join courses and related data
          .leftJoin(
            dbSchema.courses,
            eq(dbSchema.courseReviews.courseId, dbSchema.courses.id),
          )
          .leftJoin(
            dbSchema.courseCategories,
            eq(dbSchema.courses.categoryId, dbSchema.courseCategories.id),
          )
          // Left join ebooks and related data
          .leftJoin(
            dbSchema.ebooks,
            eq(dbSchema.ebookReviews.ebookId, dbSchema.ebooks.id),
          )
          .leftJoin(
            dbSchema.ebookCategories,
            eq(dbSchema.ebooks.categoryId, dbSchema.ebookCategories.id),
          )
          .innerJoin(
            dbSchema.teachers,
            or(
              eq(dbSchema.courses.teacherId, dbSchema.teachers.id),
              eq(dbSchema.ebooks.teacherId, dbSchema.teachers.id),
            ),
          )
          .innerJoin(
            teacherAccountAlias,
            eq(dbSchema.teachers.userId, teacherAccountAlias.id),
          )
          // Join latest snapshot
          .innerJoin(
            latestReviewSnapshotAlias,
            eq(latestReviewSnapshotAlias.id, latestReviewSnapshotSubquery),
          )
          .groupBy(
            dbSchema.reviews.id,
            dbSchema.users.id,
            latestReviewSnapshotAlias.id,
            dbSchema.courseReviews.id,
            dbSchema.ebookReviews.id,
            dbSchema.courses.id,
            dbSchema.courseCategories.id,
            dbSchema.ebooks.id,
            dbSchema.ebookCategories.id,
            dbSchema.teachers.id,
            teacherAccountAlias.id,
          )
          .where(
            and(
              isNull(dbSchema.reviews.deletedAt),
              isNotNull(dbSchema.reviews.orderId), // Exclude mock reviews
              where?.userId
                ? eq(dbSchema.reviews.userId, where.userId)
                : undefined,
            ),
          )
          .orderBy(
            pagination.orderBy === 'asc'
              ? asc(dbSchema.reviews.createdAt)
              : desc(dbSchema.reviews.createdAt),
          )
          .offset((pagination.page - 1) * pagination.pageSize)
          .limit(pagination.pageSize);

        // Collect review IDs
        const reviewIds = reviewsData.map((data) => data.review.id);

        // Fetch replies for these reviews
        const replyUserAlias = alias(dbSchema.users, 'replyUser');

        const repliesData = await tx
          .select({
            reply: dbSchema.reviewReplies,
            user: replyUserAlias,
            latestSnapshot: latestReplySnapshotAlias,
          })
          .from(dbSchema.reviewReplies)
          .innerJoin(
            replyUserAlias,
            eq(dbSchema.reviewReplies.userId, replyUserAlias.id),
          )
          .innerJoin(
            latestReplySnapshotAlias,
            eq(latestReplySnapshotAlias.id, latestReplySnapshotSubquery),
          )
          .where(
            and(
              inArray(dbSchema.reviewReplies.reviewId, reviewIds),
              isNull(dbSchema.reviewReplies.deletedAt),
            ),
          )
          .orderBy(asc(dbSchema.reviewReplies.createdAt));

        // Group replies by reviewId
        const repliesByReviewId = new Map<
          string,
          IReviewReplyWithRelations[]
        >();
        for (const replyData of repliesData) {
          const { reviewId } = replyData.reply;
          if (!repliesByReviewId.has(reviewId)) {
            repliesByReviewId.set(reviewId, []);
          }
          repliesByReviewId.get(reviewId)!.push({
            ...replyData.reply,
            user: replyData.user,
            snapshot: replyData.latestSnapshot,
          });
        }

        // Assemble the final results
        const reviewsWithRelations: IReviewWithRelations[] = [];

        for (const data of reviewsData) {
          const { review, user, latestSnapshot } = data;

          const repliesWithSnapshots: IReviewReplyWithRelations[] =
            repliesByReviewId.get(review.id) ?? [];

          let productData: any;
          if (review.productType === 'course') {
            if (!data.courseReview) continue; // Skip if courseReview is missing
            productData = {
              ...data.course,
              category: data.courseCategory,
              teacher: { ...data.teacher, account: data.teacherAccount },
            };
          } else if (review.productType === 'ebook') {
            if (!data.ebookReview) continue; // Skip if ebookReview is missing
            productData = {
              ...data.ebook,
              category: data.ebookCategory,
              teacher: { ...data.teacher, account: data.teacherAccount },
            };
          } else {
            continue; // Skip unknown productType
          }

          reviewsWithRelations.push({
            ...review,
            user,
            snapshot: latestSnapshot,
            replies: repliesWithSnapshots,
            product: productData,
          } satisfies IReviewWithRelations);
        }

        // Fetch total count of reviews
        const [{ totalCount }] = await tx
          .select({ totalCount: count() })
          .from(dbSchema.reviews)
          .where(
            and(
              isNull(dbSchema.reviews.deletedAt),
              isNotNull(dbSchema.reviews.orderId),
              where?.userId
                ? eq(dbSchema.reviews.userId, where.userId)
                : undefined,
            ),
          );

        return { reviewsWithRelations, totalCount };
      });

    return {
      pagination,
      totalCount,
      data: reviewsWithRelations,
    };
  }

  async findManyWithCourseReviews({
    where,
    pagination,
  }: {
    where: OptionalPick<ICourseReviewRelationsCreate, 'courseId' | 'userId'>;
    pagination: Pagination;
  }): Promise<Paginated<IReviewWithRelations[]>> {
    const { reviewsWithRelations, totalCount } =
      await this.drizzle.db.transaction(async (tx) => {
        const latestReviewSnapshotSQL = tx
          .select({ id: dbSchema.reviewSnapshots.id })
          .from(dbSchema.reviewSnapshots)
          .where(eq(dbSchema.reviewSnapshots.reviewId, dbSchema.reviews.id))
          .orderBy(desc(dbSchema.reviewSnapshots.createdAt))
          .limit(1);

        // Alias the users table for the teacher's account
        const teacherAccountAlias = alias(dbSchema.users, 'teacherAccount');

        // Fetch the main data
        const courseReviews = await tx
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
              where.userId
                ? eq(dbSchema.reviews.userId, where.userId)
                : undefined,
              isNotNull(dbSchema.reviews.orderId), // filter mock reviews
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

        const latestReplySnapshotSQL = tx
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
        const replies = await tx
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
        const repliesByReviewId = new Map<
          string,
          IReviewReplyWithRelations[]
        >();
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

        const [{ totalCount }] = await tx
          .select({ totalCount: count() })
          .from(dbSchema.courseReviews)
          .innerJoin(
            dbSchema.reviews,
            eq(dbSchema.courseReviews.reviewId, dbSchema.reviews.id),
          )
          .where(
            and(
              where.courseId
                ? eq(dbSchema.courseReviews.courseId, where.courseId)
                : undefined,
              where.userId
                ? eq(dbSchema.reviews.userId, where.userId)
                : undefined,
              isNotNull(dbSchema.reviews.orderId), // filter mock reviews
              isNull(dbSchema.reviews.deletedAt),
            ),
          );

        return { reviewsWithRelations, totalCount };
      });

    return {
      pagination,
      totalCount: totalCount ?? 0,
      data: reviewsWithRelations,
    };
  }

  async findManyWithEbookReviews({
    where,
    pagination,
  }: {
    where: OptionalPick<IEbookReviewRelationsCreate, 'ebookId' | 'userId'>;
    pagination: Pagination;
  }): Promise<Paginated<IReviewWithRelations[]>> {
    const { reviewsWithRelations, totalCount } =
      await this.drizzle.db.transaction(async (tx) => {
        // Alias the users table for the teacher's account
        const teacherAccountAlias = alias(dbSchema.users, 'teacherAccount');

        const latestReviewSnapshotSQL = tx
          .select({ id: dbSchema.reviewSnapshots.id })
          .from(dbSchema.reviewSnapshots)
          .where(eq(dbSchema.reviewSnapshots.reviewId, dbSchema.reviews.id))
          .orderBy(desc(dbSchema.reviewSnapshots.createdAt))
          .limit(1);

        const ebookReviews = await tx
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
              where.userId
                ? eq(dbSchema.reviews.userId, where.userId)
                : undefined,
              isNotNull(dbSchema.reviews.orderId), // filter mock reviews
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

        const latestReplySnapshotSQL = tx
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
        const replies = await tx
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
        const repliesByReviewId = new Map<
          string,
          IReviewReplyWithRelations[]
        >();
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

        const [{ totalCount }] = await tx
          .select({ totalCount: count() })
          .from(dbSchema.ebookReviews)
          .innerJoin(
            dbSchema.reviews,
            eq(dbSchema.ebookReviews.reviewId, dbSchema.reviews.id),
          )
          .where(
            and(
              where.ebookId
                ? eq(dbSchema.ebookReviews.ebookId, where.ebookId)
                : undefined,
              where.userId
                ? eq(dbSchema.reviews.userId, where.userId)
                : undefined,
              isNotNull(dbSchema.reviews.orderId), // filter mock reviews
              isNull(dbSchema.reviews.deletedAt),
            ),
          );

        return { reviewsWithRelations, totalCount };
      });

    return {
      pagination,
      totalCount: totalCount ?? 0,
      data: reviewsWithRelations,
    };
  }
}
