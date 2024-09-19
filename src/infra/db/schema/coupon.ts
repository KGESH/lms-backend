import { couponCriteriaType, discountType, couponDirection } from './enum';
import {
  decimal,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './user';
import { orders } from './order';

export const coupons = pgTable('coupons', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  description: text('description'),
  discountType: discountType('discount_type').notNull(),
  value: decimal('value').notNull(),
  threshold: decimal('threshold'),
  limit: decimal('limit'),
  volume: integer('volume'),
  volumePerCitizen: integer('volume_per_citizen'),
  expiredIn: integer('expired_in'),
  expiredAt: timestamp('expired_at', { mode: 'date', withTimezone: true }),
  openedAt: timestamp('opened_at', { mode: 'date', withTimezone: true }),
  closedAt: timestamp('closed_at', { mode: 'date', withTimezone: true }),
});

export const couponDisposables = pgTable('coupon_disposables', {
  id: uuid('id').primaryKey().defaultRandom(),
  couponId: uuid('coupon_id').notNull(),
  code: text('code').notNull().unique(),
  createdAt: timestamp('created_at', { mode: 'date', withTimezone: true })
    .notNull()
    .defaultNow(),
  expiredAt: timestamp('expired_at', {
    mode: 'date',
    withTimezone: true,
  }),
});

export const couponTickets = pgTable('coupon_tickets', {
  id: uuid('id').primaryKey().defaultRandom(),
  couponId: uuid('coupon_id').notNull(),
  userId: uuid('user_id').notNull(),
  couponDisposableId: uuid('coupon_disposable_id'),
  createdAt: timestamp('created_at', { mode: 'date', withTimezone: true })
    .notNull()
    .defaultNow(),
  expiredAt: timestamp('expired_at', { mode: 'date', withTimezone: true }),
});

export const couponTicketPayments = pgTable('coupon_ticket_payments', {
  id: uuid('id').primaryKey().defaultRandom(),
  couponTicketId: uuid('coupon_ticket_id').notNull().unique(),
  orderId: uuid('order_id').notNull(),
  createdAt: timestamp('created_at', { mode: 'date', withTimezone: true })
    .notNull()
    .defaultNow(),
  deletedAt: timestamp('deleted_at', { mode: 'date', withTimezone: true }),
});

export const couponAllCriteria = pgTable('coupon_all_criteria', {
  id: uuid('id').primaryKey().defaultRandom(),
  couponId: uuid('coupon_id').notNull(),
  type: couponCriteriaType('type').notNull(),
  direction: couponDirection('direction').notNull(),
});

export const couponCategoryCriteria = pgTable('coupon_category_criteria', {
  id: uuid('id').primaryKey().defaultRandom(),
  couponId: uuid('coupon_id').notNull(),
  type: couponCriteriaType('type').notNull(),
  direction: couponDirection('direction').notNull(),
  categoryId: uuid('category_id').notNull(),
});

export const couponTeacherCriteria = pgTable('coupon_teacher_criteria', {
  id: uuid('id').primaryKey().defaultRandom(),
  couponId: uuid('coupon_id').notNull(),
  type: couponCriteriaType('type').notNull(),
  direction: couponDirection('direction').notNull(),
  teacherId: uuid('teacher_id').notNull(),
});

export const couponCourseCriteria = pgTable('coupon_course_criteria', {
  id: uuid('id').primaryKey().defaultRandom(),
  couponId: uuid('coupon_id').notNull(),
  type: couponCriteriaType('type').notNull(),
  direction: couponDirection('direction').notNull(),
  courseId: uuid('course_id').notNull(),
});

export const couponEbookCriteria = pgTable('coupon_ebook_criteria', {
  id: uuid('id').primaryKey().defaultRandom(),
  couponId: uuid('coupon_id').notNull(),
  type: couponCriteriaType('type').notNull(),
  direction: couponDirection('direction').notNull(),
  ebookId: uuid('ebook_id').notNull(),
});

export const couponsRelations = relations(coupons, ({ many }) => ({
  couponDisposables: many(couponDisposables),
  couponTickets: many(couponTickets),
  couponAllCriteria: many(couponAllCriteria),
  couponCategoryCriteria: many(couponCategoryCriteria),
  couponTeacherCriteria: many(couponTeacherCriteria),
  couponCourseCriteria: many(couponCourseCriteria),
  couponEbookCriteria: many(couponEbookCriteria),
}));

export const couponDisposablesRelations = relations(
  couponDisposables,
  ({ one }) => ({
    coupon: one(coupons, {
      fields: [couponDisposables.couponId],
      references: [coupons.id],
    }),
  }),
);

export const couponTicketsRelations = relations(couponTickets, ({ one }) => ({
  user: one(users, {
    fields: [couponTickets.userId],
    references: [users.id],
  }),
  coupon: one(coupons, {
    fields: [couponTickets.couponId],
    references: [coupons.id],
  }),
  couponDisposable: one(couponDisposables),
  couponTicketPayment: one(couponTicketPayments),
}));

export const couponTicketPaymentsRelations = relations(
  couponTicketPayments,
  ({ one }) => ({
    couponTicket: one(couponTickets, {
      fields: [couponTicketPayments.couponTicketId],
      references: [couponTickets.id],
    }),
    order: one(orders, {
      fields: [couponTicketPayments.orderId],
      references: [orders.id],
    }),
  }),
);

export const couponDbSchema = {
  // Entities
  coupons,
  couponDisposables,
  couponTickets,
  couponTicketPayments,
  couponAllCriteria,
  couponCategoryCriteria,
  couponTeacherCriteria,
  couponCourseCriteria,
  couponEbookCriteria,

  // Relations
  couponsRelations,
  couponDisposablesRelations,
  couponTicketsRelations,
  couponTicketPaymentsRelations,
};
