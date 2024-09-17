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
  expiredIn: timestamp('expired_in', { mode: 'date', withTimezone: true }),
  expiredAt: timestamp('expired_at', { mode: 'date', withTimezone: true }),
  openedAt: timestamp('opened_at', { mode: 'date', withTimezone: true }),
  closedAt: timestamp('closed_at', { mode: 'date', withTimezone: true }),
  volume: integer('volume'),
  volumePerCitizen: integer('volume_per_citizen'),
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
  }).notNull(),
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
  couponTicketId: uuid('coupon_ticket_id').notNull(),
  orderId: uuid('order_id').notNull(),
  createdAt: timestamp('created_at', { mode: 'date', withTimezone: true })
    .notNull()
    .defaultNow(),
  deletedAt: timestamp('deleted_at', { mode: 'date', withTimezone: true }),
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

export const couponsRelations = relations(coupons, ({ one, many }) => ({
  couponDisposables: many(couponDisposables),
  couponTickets: many(couponTickets),
  couponCategoryCriteria: many(couponCategoryCriteria),
  couponTeacherCriteria: many(couponTeacherCriteria),
  couponCourseCriteria: many(couponCourseCriteria),
  couponEbookCriteria: many(couponEbookCriteria),
}));

export const couponDisposablesRelations = relations(
  couponDisposables,
  ({ one }) => ({
    coupon: one(coupons),
  }),
);

export const couponTicketsRelations = relations(couponTickets, ({ one }) => ({
  coupon: one(coupons),
  couponDisposable: one(couponDisposables),
  user: one(users),
}));

export const couponTicketPaymentsRelations = relations(
  couponTicketPayments,
  ({ one }) => ({
    couponTicket: one(couponTickets),
    order: one(orders),
  }),
);

export const couponDbSchema = {
  // Entities
  coupons,
  couponDisposables,
  couponTickets,
  couponTicketPayments,
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
