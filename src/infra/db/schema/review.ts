import {
  AnyPgColumn,
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

export const reviews = pgTable('reviews', {
  id: uuid('id').primaryKey().defaultRandom(),
  orderId: uuid('order_id'),
  userId: uuid('user_id')
    .references(() => users.id)
    .notNull(),
  productType: productType('product_type').notNull(),
  createdAt: timestamp('created_at', { mode: 'date', withTimezone: true })
    .notNull()
    .defaultNow(),
  deletedAt: timestamp('deleted_at', { mode: 'date', withTimezone: true }),
});

export const reviewSnapshots = pgTable('review_snapshots', {
  id: uuid('id').primaryKey().defaultRandom(),
  reviewId: uuid('review_id')
    .references(() => reviews.id)
    .notNull(),
  comment: text('comment').notNull(),
  rating: real('rating').notNull(),
  createdAt: timestamp('created_at', { mode: 'date', withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const reviewReplies = pgTable('review_replies', {
  id: uuid('id').primaryKey().defaultRandom(),
  reviewId: uuid('review_id')
    .references(() => reviews.id)
    .notNull(),
  userId: uuid('user_id')
    .references(() => users.id)
    .notNull(),
  parentId: uuid('parent_id').references((): AnyPgColumn => reviewReplies.id),
  createdAt: timestamp('created_at', { mode: 'date', withTimezone: true })
    .notNull()
    .defaultNow(),
  deletedAt: timestamp('deleted_at', { mode: 'date', withTimezone: true }),
});

export const reviewReplySnapshots = pgTable('review_reply_snapshots', {
  id: uuid('id').primaryKey().defaultRandom(),
  reviewReplyId: uuid('review_reply_id')
    .references(() => reviewReplies.id)
    .notNull(),
  comment: text('comment').notNull(),
  createdAt: timestamp('created_at', { mode: 'date', withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const courseReviews = pgTable('course_reviews', {
  id: uuid('id').primaryKey().defaultRandom(),
  reviewId: uuid('review_id')
    .references(() => reviews.id)
    .notNull(),
  courseId: uuid('course_id')
    .references(() => courses.id)
    .notNull(),
});

export const ebookReviews = pgTable('ebook_reviews', {
  id: uuid('id').primaryKey().defaultRandom(),
  reviewId: uuid('review_id')
    .references(() => reviews.id)
    .notNull(),
  ebookId: uuid('ebook_id')
    .references(() => ebooks.id)
    .notNull(),
});

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
    parent: one(reviewReplies, {
      fields: [reviewReplies.parentId],
      references: [reviewReplies.id],
      relationName: 'review_replies_relation',
    }),
    children: many(reviewReplies, {
      relationName: 'review_replies_relation',
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
