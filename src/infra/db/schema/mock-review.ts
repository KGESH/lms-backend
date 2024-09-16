import { timestamp, pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { reviews } from './review';
import { userRole } from './enum';

export const mockReviewUsers = pgTable('mock_review_users', {
  id: uuid('id').primaryKey().defaultRandom(),
  reviewId: uuid('review_id')
    .notNull()
    .references(() => reviews.id, { onDelete: 'cascade' }),
  displayName: text('display_name').notNull(),
  email: text('email').unique().notNull(),
  image: text('image'),
  emailVerified: timestamp('emailVerified', {
    mode: 'date',
    withTimezone: true,
  }),
  role: userRole('role').notNull().default('user'),
  createdAt: timestamp('created_at', { mode: 'date', withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'date', withTimezone: true })
    .notNull()
    .defaultNow(),
  deletedAt: timestamp('deleted_at', { mode: 'date', withTimezone: true }),
});

export const mockReviewUserRelations = relations(
  mockReviewUsers,
  ({ one }) => ({
    review: one(reviews, {
      fields: [mockReviewUsers.reviewId],
      references: [reviews.id],
    }),
  }),
);

export const mockReviewDbSchema = {
  // Entities
  mockReviewUsers,

  // Relations
  mockReviewUserRelations,
};
