import { decimal, pgTable, text, uuid, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './user';
import { courseProductSnapshots } from './course';

export const courseOrders = pgTable('course_orders', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull(),
  courseProductSnapshotId: uuid('course_product_snapshot_id').notNull(),
  paymentMethod: text('payment_method').notNull(),
  amount: decimal('amount').notNull(),
  paidAt: timestamp('paid_at', { mode: 'date', withTimezone: true }),
});

export const courseOrderRefunds = pgTable('course_order_refunds', {
  id: uuid('id').primaryKey().defaultRandom(),
  courseOrderId: uuid('course_order_id').notNull(),
  refundedAmount: decimal('refunded_amount').notNull(),
  refundedAt: timestamp('refunded_at', { mode: 'date', withTimezone: true }),
});

export const courseOrderRelations = relations(
  courseOrders,
  ({ one, many }) => ({
    user: one(users, {
      fields: [courseOrders.userId],
      references: [users.id],
    }),
    product: one(courseProductSnapshots, {
      fields: [courseOrders.courseProductSnapshotId],
      references: [courseProductSnapshots.id],
    }),
    refunds: many(courseOrderRefunds),
  }),
);

export const courseOrderRefundRelations = relations(
  courseOrderRefunds,
  ({ one }) => ({
    order: one(courseOrders, {
      fields: [courseOrderRefunds.courseOrderId],
      references: [courseOrders.id],
    }),
  }),
);

export const courseOrderDbSchema = {
  // Entities
  courseOrders,
  courseOrderRefunds,

  // Relations
  courseOrderRelations,
  courseOrderRefundRelations,
};
