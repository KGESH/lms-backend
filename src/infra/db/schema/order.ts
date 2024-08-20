import { decimal, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { productType } from './enum';
import { relations } from 'drizzle-orm';
import { courseProductSnapshots } from './course';
import { users } from './user';
import { reviews } from './review';

export const orders = pgTable('orders', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull(),
  productType: productType('product_type').notNull(),
  paymentMethod: text('payment_method').notNull(),
  amount: decimal('amount').notNull(),
  paidAt: timestamp('paid_at', { mode: 'date', withTimezone: true }),
});

export const courseOrders = pgTable('course_orders', {
  id: uuid('id').primaryKey().defaultRandom(),
  orderId: uuid('order_id').notNull(),
  productSnapshotId: uuid('product_snapshot_id').notNull(),
});

export const orderRefunds = pgTable('course_order_refunds', {
  id: uuid('id').primaryKey().defaultRandom(),
  orderId: uuid('order_id').notNull(),
  refundedAmount: decimal('refunded_amount').notNull(),
  refundedAt: timestamp('refunded_at', { mode: 'date', withTimezone: true }),
});

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  courseOrder: one(courseOrders),
  // ebookOrder
  refunds: many(orderRefunds),
  review: one(reviews),
}));

export const courseOrdersRelations = relations(courseOrders, ({ one }) => ({
  order: one(orders, {
    fields: [courseOrders.orderId],
    references: [orders.id],
  }),
  productSnapshot: one(courseProductSnapshots, {
    fields: [courseOrders.productSnapshotId],
    references: [courseProductSnapshots.id],
  }),
}));

export const orderRefundsRelations = relations(orderRefunds, ({ one }) => ({
  order: one(orders, {
    fields: [orderRefunds.orderId],
    references: [orders.id],
  }),
}));

export const courseOrderDbSchema = {
  orders,
  courseOrders,
  orderRefunds,

  ordersRelations,
  courseOrdersRelations,
  orderRefundsRelations,
};
