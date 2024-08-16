import { decimal, pgTable, text, uuid, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './user';
import { courseProductSnapshots } from './course';
import { productType } from './enum';

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
  // userId: uuid('user_id').notNull(),
  // paymentMethod: text('payment_method').notNull(),
  // amount: decimal('amount').notNull(),
  // paidAt: timestamp('paid_at', { mode: 'date', withTimezone: true }),
});

export const orderRefunds = pgTable('course_order_refunds', {
  id: uuid('id').primaryKey().defaultRandom(),
  orderId: uuid('order_id').notNull(),
  refundedAmount: decimal('refunded_amount').notNull(),
  refundedAt: timestamp('refunded_at', { mode: 'date', withTimezone: true }),
});
// export const courseOrderRefunds = pgTable('course_order_refunds', {
//   id: uuid('id').primaryKey().defaultRandom(),
//   courseOrderId: uuid('course_order_id').notNull(),
//   refundedAmount: decimal('refunded_amount').notNull(),
//   refundedAt: timestamp('refunded_at', { mode: 'date', withTimezone: true }),
// });

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  courseOrder: one(courseOrders, {
    fields: [orders.id],
    references: [courseOrders.orderId],
  }),
  // ebookOrder
  refunds: many(orderRefunds),
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

// export const courseOrdersRelations = relations(
//   courseOrders,
//   ({ one, many }) => ({
//     user: one(users, {
//       fields: [courseOrders.userId],
//       references: [users.id],
//     }),
//     productSnapshot: one(courseProductSnapshots, {
//       fields: [courseOrders.courseProductSnapshotId],
//       references: [courseProductSnapshots.id],
//     }),
//     refunds: many(courseOrderRefunds),
//   }),
// );
// export const courseOrderRefundRelations = relations(
//   courseOrderRefunds,
//   ({ one }) => ({
//     order: one(courseOrders, {
//       fields: [courseOrderRefunds.courseOrderId],
//       references: [courseOrders.id],
//     }),
//   }),
// );

export const orderRefundsRelations = relations(orderRefunds, ({ one }) => ({
  order: one(orders, {
    fields: [orderRefunds.orderId],
    references: [orders.id],
  }),
}));

export const courseOrderDbSchema = {
  // Entities
  orders,
  courseOrders,
  // courseOrderRefunds,
  orderRefunds,

  // Relations
  ordersRelations,
  courseOrdersRelations,
  orderRefundsRelations,
  // courseOrderRefundRelations,
};
