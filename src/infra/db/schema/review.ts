import {
  index,
  pgTable,
  real,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';
import { users } from './user';
import { courses } from './course';
import { productType } from './enum';
import { relations } from 'drizzle-orm';
import { orders } from './order';
import { ebooks } from './ebook';
import { mockReviewUsers } from './mock-review';

export const reviews = pgTable(
  'reviews',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    orderId: uuid('order_id'),
    userId: uuid('user_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    productType: productType('product_type').notNull(),
    createdAt: timestamp('created_at', { mode: 'date', withTimezone: true })
      .notNull()
      .defaultNow(),
    deletedAt: timestamp('deleted_at', { mode: 'date', withTimezone: true }),
    deletedBy: uuid('deleted_by'),
    deletedReason: text('deleted_reason'),
  },
  (table) => ({
    orderIdIdx: index('idx_reviews_order_id').on(table.orderId),
    userIdIdx: index('idx_reviews_user_id').on(table.userId),
    createdAtIdx: index('idx_reviews_created_at').on(table.createdAt),
    deletedAtIdx: index('idx_reviews_deleted_at').on(table.deletedAt),
  }),
);

export const reviewSnapshots = pgTable(
  'review_snapshots',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    reviewId: uuid('review_id')
      .references(() => reviews.id, { onDelete: 'cascade' })
      .notNull(),
    comment: text('comment').notNull(),
    rating: real('rating').notNull(),
    createdAt: timestamp('created_at', { mode: 'date', withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    reviewIdIdx: index('idx_review_snapshots_review_id').on(table.reviewId),
    createdAtIdx: index('idx_review_snapshots_created_at').on(table.createdAt),
  }),
);

export const reviewReplies = pgTable(
  'review_replies',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    reviewId: uuid('review_id')
      .references(() => reviews.id, { onDelete: 'cascade' })
      .notNull(),
    userId: uuid('user_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    createdAt: timestamp('created_at', { mode: 'date', withTimezone: true })
      .notNull()
      .defaultNow(),
    deletedAt: timestamp('deleted_at', { mode: 'date', withTimezone: true }),
  },
  (table) => ({
    reviewIdIdx: index('idx_review_replies_review_id').on(table.reviewId),
    userIdIdx: index('idx_review_replies_user_id').on(table.userId),
    createdAtIdx: index('idx_review_replies_created_at').on(table.createdAt),
  }),
);

export const reviewReplySnapshots = pgTable(
  'review_reply_snapshots',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    reviewReplyId: uuid('review_reply_id')
      .references(() => reviewReplies.id, { onDelete: 'cascade' })
      .notNull(),
    comment: text('comment').notNull(),
    createdAt: timestamp('created_at', { mode: 'date', withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    reviewReplyIdIdx: index('idx_review_reply_snapshots_review_reply_id').on(
      table.reviewReplyId,
    ),
    createdAtIdx: index('idx_review_reply_snapshots_created_at').on(
      table.createdAt,
    ),
  }),
);

export const courseReviews = pgTable(
  'course_reviews',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    reviewId: uuid('review_id')
      .references(() => reviews.id, { onDelete: 'cascade' })
      .notNull(),
    courseId: uuid('course_id')
      .references(() => courses.id, { onDelete: 'cascade' })
      .notNull(),
    createdAt: timestamp('created_at', {
      mode: 'date',
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),
    deletedAt: timestamp('deleted_at', {
      mode: 'date',
      withTimezone: true,
    }),
  },
  (table) => ({
    reviewIdIdx: index('idx_course_reviews_review_id').on(table.reviewId),
    courseIdIdx: index('idx_course_reviews_course_id').on(table.courseId),
    createdAtIdx: index('idx_course_reviews_created_at').on(table.createdAt),
    deletedAtIdx: index('idx_course_reviews_deleted_at').on(table.deletedAt),
  }),
);

export const ebookReviews = pgTable(
  'ebook_reviews',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    reviewId: uuid('review_id')
      .references(() => reviews.id, { onDelete: 'cascade' })
      .notNull(),
    ebookId: uuid('ebook_id')
      .references(() => ebooks.id, { onDelete: 'cascade' })
      .notNull(),
    createdAt: timestamp('created_at', {
      mode: 'date',
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),
    deletedAt: timestamp('deleted_at', {
      mode: 'date',
      withTimezone: true,
    }),
  },
  (table) => ({
    reviewIdIdx: index('idx_ebook_reviews_review_id').on(table.reviewId),
    ebookIdIdx: index('idx_ebook_reviews_ebook_id').on(table.ebookId),
    createdAtIdx: index('idx_ebook_reviews_created_at').on(table.createdAt),
    deletedAtIdx: index('idx_ebook_reviews_deleted_at').on(table.deletedAt),
  }),
);

export const reviewsRelations = relations(reviews, ({ one, many }) => ({
  order: one(orders, {
    fields: [reviews.orderId],
    references: [orders.id],
  }),
  user: one(users, {
    fields: [reviews.userId],
    references: [users.id],
  }),
  courseReview: one(courseReviews),
  ebookReview: one(ebookReviews),
  replies: many(reviewReplies),
  snapshots: many(reviewSnapshots),
  mockUser: one(mockReviewUsers),
}));

export const reviewSnapshotsRelations = relations(
  reviewSnapshots,
  ({ one }) => ({
    review: one(reviews, {
      fields: [reviewSnapshots.reviewId],
      references: [reviews.id],
    }),
  }),
);

export const reviewRepliesRelations = relations(
  reviewReplies,
  ({ one, many }) => ({
    user: one(users, {
      fields: [reviewReplies.userId],
      references: [users.id],
    }),
    review: one(reviews, {
      fields: [reviewReplies.reviewId],
      references: [reviews.id],
    }),
    snapshots: many(reviewReplySnapshots),
  }),
);
export const reviewReplySnapshotsRelations = relations(
  reviewReplySnapshots,
  ({ one }) => ({
    reviewReply: one(reviewReplies, {
      fields: [reviewReplySnapshots.reviewReplyId],
      references: [reviewReplies.id],
    }),
  }),
);

export const courseReviewsRelations = relations(courseReviews, ({ one }) => ({
  review: one(reviews, {
    fields: [courseReviews.reviewId],
    references: [reviews.id],
  }),
  course: one(courses, {
    fields: [courseReviews.courseId],
    references: [courses.id],
  }),
}));

export const ebookReviewRelations = relations(ebookReviews, ({ one }) => ({
  review: one(reviews, {
    fields: [ebookReviews.reviewId],
    references: [reviews.id],
  }),
  ebook: one(ebooks, {
    fields: [ebookReviews.ebookId],
    references: [ebooks.id],
  }),
}));

export const reviewDbSchema = {
  // Entities
  reviews,
  reviewSnapshots,
  reviewReplies,
  reviewReplySnapshots,
  courseReviews,
  ebookReviews,

  // Relations
  reviewsRelations,
  reviewSnapshotsRelations,
  reviewRepliesRelations,
  reviewReplySnapshotsRelations,
  courseReviewsRelations,
  ebookReviewRelations,
};
