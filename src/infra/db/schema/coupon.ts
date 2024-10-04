import { couponCriteriaType, discountType, couponDirection } from './enum';
import {
  decimal,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './user';
import { orders } from './order';
import { courseCategories, courses } from './course';
import { teachers } from './teacher';
import { ebooks } from './ebook';
import { Price } from '@src/shared/types/primitive';

export const coupons = pgTable(
  'coupons',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    description: text('description'),
    discountType: discountType('discount_type').notNull(),
    value: decimal('value').$type<Price>().notNull(),
    threshold: decimal('threshold').$type<Price>(),
    limit: decimal('limit').$type<Price>(),
    volume: integer('volume'),
    volumePerCitizen: integer('volume_per_citizen'),
    expiredIn: integer('expired_in'),
    expiredAt: timestamp('expired_at', { mode: 'date', withTimezone: true }),
    openedAt: timestamp('opened_at', { mode: 'date', withTimezone: true }),
    closedAt: timestamp('closed_at', { mode: 'date', withTimezone: true }),
  },
  (table) => ({
    expiredAtIdx: index('idx_coupons_expired_at').on(table.expiredAt),
  }),
);

export const couponDisposables = pgTable(
  'coupon_disposables',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    couponId: uuid('coupon_id').notNull(),
    code: text('code').notNull(),
    createdAt: timestamp('created_at', { mode: 'date', withTimezone: true })
      .notNull()
      .defaultNow(),
    expiredAt: timestamp('expired_at', {
      mode: 'date',
      withTimezone: true,
    }),
  },
  (table) => ({
    couponIdIdx: index('idx_coupon_disposables_coupon_id').on(table.couponId),
    codeIdx: uniqueIndex('idx_coupon_disposables_code').on(table.code),
    expiredAtIdx: index('idx_coupon_disposables_expired_at').on(
      table.expiredAt,
    ),
  }),
);

export const couponTickets = pgTable(
  'coupon_tickets',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    couponId: uuid('coupon_id').notNull(),
    userId: uuid('user_id').notNull(),
    couponDisposableId: uuid('coupon_disposable_id'),
    createdAt: timestamp('created_at', { mode: 'date', withTimezone: true })
      .notNull()
      .defaultNow(),
    expiredAt: timestamp('expired_at', { mode: 'date', withTimezone: true }),
  },
  (table) => ({
    couponIdIdx: index('idx_coupon_tickets_coupon_id').on(table.couponId),
    userIdIdx: index('idx_coupon_tickets_user_id').on(table.userId),
    expiredAtIdx: index('idx_coupon_tickets_expired_at').on(table.expiredAt),
  }),
);

export const couponTicketPayments = pgTable(
  'coupon_ticket_payments',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    couponTicketId: uuid('coupon_ticket_id')
      .notNull()
      .references(() => couponTickets.id),
    orderId: uuid('order_id').notNull(),
    createdAt: timestamp('created_at', { mode: 'date', withTimezone: true })
      .notNull()
      .defaultNow(),
    deletedAt: timestamp('deleted_at', { mode: 'date', withTimezone: true }),
  },
  (table) => ({
    couponTicketIdIdx: uniqueIndex(
      'idx_coupon_ticket_payments_coupon_ticket_id',
    ).on(table.couponTicketId),
    orderIdIdx: index('idx_coupon_ticket_payments_order_id').on(table.orderId),
  }),
);

export const couponAllCriteria = pgTable(
  'coupon_all_criteria',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    couponId: uuid('coupon_id').notNull(),
    type: couponCriteriaType('type').notNull(),
    direction: couponDirection('direction').notNull(),
  },
  (table) => ({
    couponIdIdx: index('idx_coupon_all_criteria_coupon_id').on(table.couponId),
  }),
);

export const couponCategoryCriteria = pgTable(
  'coupon_category_criteria',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    couponId: uuid('coupon_id').notNull(),
    type: couponCriteriaType('type').notNull(),
    direction: couponDirection('direction').notNull(),
    categoryId: uuid('category_id').notNull(),
  },
  (table) => ({
    couponIdIdx: index('idx_coupon_category_criteria_coupon_id').on(
      table.couponId,
    ),
  }),
);

export const couponTeacherCriteria = pgTable(
  'coupon_teacher_criteria',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    couponId: uuid('coupon_id').notNull(),
    type: couponCriteriaType('type').notNull(),
    direction: couponDirection('direction').notNull(),
    teacherId: uuid('teacher_id').notNull(),
  },
  (table) => ({
    couponIdIdx: index('idx_coupon_teacher_criteria_coupon_id').on(
      table.couponId,
    ),
  }),
);

export const couponCourseCriteria = pgTable(
  'coupon_course_criteria',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    couponId: uuid('coupon_id').notNull(),
    type: couponCriteriaType('type').notNull(),
    direction: couponDirection('direction').notNull(),
    courseId: uuid('course_id').notNull(),
  },
  (table) => ({
    couponIdIdx: index('idx_coupon_course_criteria_coupon_id').on(
      table.couponId,
    ),
  }),
);

export const couponEbookCriteria = pgTable(
  'coupon_ebook_criteria',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    couponId: uuid('coupon_id').notNull(),
    type: couponCriteriaType('type').notNull(),
    direction: couponDirection('direction').notNull(),
    ebookId: uuid('ebook_id').notNull(),
  },
  (table) => ({
    couponIdIdx: index('idx_coupon_ebook_criteria_coupon_id').on(
      table.couponId,
    ),
  }),
);

export const couponsRelations = relations(coupons, ({ many }) => ({
  couponDisposables: many(couponDisposables),
  couponTickets: many(couponTickets),
  couponAllCriteria: many(couponAllCriteria),
  couponCategoryCriteria: many(couponCategoryCriteria),
  couponTeacherCriteria: many(couponTeacherCriteria),
  couponCourseCriteria: many(couponCourseCriteria),
  couponEbookCriteria: many(couponEbookCriteria),
}));

export const couponAllCriteriaRelations = relations(
  couponAllCriteria,
  ({ one }) => ({
    coupon: one(coupons, {
      fields: [couponAllCriteria.couponId],
      references: [coupons.id],
    }),
  }),
);

export const couponCategoryCriteriaRelations = relations(
  couponCategoryCriteria,
  ({ one }) => ({
    coupon: one(coupons, {
      fields: [couponCategoryCriteria.couponId],
      references: [coupons.id],
    }),
    category: one(courseCategories, {
      fields: [couponCategoryCriteria.categoryId],
      references: [courseCategories.id],
    }),
  }),
);

export const couponTeacherCriteriaRelations = relations(
  couponTeacherCriteria,
  ({ one }) => ({
    coupon: one(coupons, {
      fields: [couponTeacherCriteria.couponId],
      references: [coupons.id],
    }),
    teacher: one(teachers, {
      fields: [couponTeacherCriteria.teacherId],
      references: [teachers.id],
    }),
  }),
);

export const couponCourseCriteriaRelations = relations(
  couponCourseCriteria,
  ({ one }) => ({
    coupon: one(coupons, {
      fields: [couponCourseCriteria.couponId],
      references: [coupons.id],
    }),
    course: one(courses, {
      fields: [couponCourseCriteria.courseId],
      references: [courses.id],
    }),
  }),
);

export const couponEbookCriteriaRelations = relations(
  couponEbookCriteria,
  ({ one }) => ({
    coupon: one(coupons, {
      fields: [couponEbookCriteria.couponId],
      references: [coupons.id],
    }),
    ebook: one(ebooks, {
      fields: [couponEbookCriteria.ebookId],
      references: [ebooks.id],
    }),
  }),
);

export const couponDisposablesRelations = relations(
  couponDisposables,
  ({ one }) => ({
    coupon: one(coupons, {
      fields: [couponDisposables.couponId],
      references: [coupons.id],
    }),
    ticket: one(couponTickets),
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
  couponDisposable: one(couponDisposables, {
    fields: [couponTickets.couponDisposableId],
    references: [couponDisposables.id],
  }),
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
  couponAllCriteriaRelations,
  couponCategoryCriteriaRelations,
  couponTeacherCriteriaRelations,
  couponCourseCriteriaRelations,
  couponEbookCriteriaRelations,
  couponDisposablesRelations,
  couponTicketsRelations,
  couponTicketPaymentsRelations,
};
