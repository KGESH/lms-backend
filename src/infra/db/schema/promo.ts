import { promoContentType } from './enum';
import {
  integer,
  pgTable,
  text,
  uuid,
  timestamp,
  index,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { coupons } from './coupon';
import { files } from './file';

export const promotions = pgTable(
  'promotions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    title: text('name').notNull(),
    description: text('description'),
    couponId: uuid('coupon_id').references(() => coupons.id),
    openedAt: timestamp('opened_at', {
      mode: 'date',
      withTimezone: true,
    }),
    closedAt: timestamp('closed_at', {
      mode: 'date',
      withTimezone: true,
    }),
    createdAt: timestamp('created_at', { mode: 'date', withTimezone: true })
      .notNull()
      .defaultNow(),
    deletedAt: timestamp('deleted_at', { mode: 'date', withTimezone: true }),
  },
  (table) => ({
    couponIdIdx: index('idx_promotions_coupon_id').on(table.couponId),
    openedAtIdx: index('idx_promotions_opened_at').on(table.openedAt),
    closedAtIdx: index('idx_promotions_closed_at').on(table.closedAt),
    createdAtIdx: index('idx_promotions_created_at').on(table.createdAt),
  }),
);

export const promotionContents = pgTable(
  'promotion_contents',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    promotionId: uuid('promotion_id')
      .notNull()
      .references(() => promotions.id),
    fileId: uuid('file_id').references(() => files.id),
    type: promoContentType('type').notNull(),
    title: text('title').notNull(),
    description: text('description'),
    sequence: integer('sequence').notNull(),
  },
  (table) => ({
    promotionIdIdx: index('idx_promotion_contents_promotion_id').on(
      table.promotionId,
    ),
  }),
);

export const promotionsRelations = relations(promotions, ({ one, many }) => ({
  coupon: one(coupons, {
    fields: [promotions.couponId],
    references: [coupons.id],
  }),
  contents: many(promotionContents),
}));

export const promotionContentRelations = relations(
  promotionContents,
  ({ one }) => ({
    promotion: one(promotions, {
      fields: [promotionContents.promotionId],
      references: [promotions.id],
    }),
    file: one(files, {
      fields: [promotionContents.fileId],
      references: [files.id],
    }),
  }),
);

export const promoDbSchema = {
  // Entities
  promotions,
  promotionContents,

  // Relations
  promotionsRelations,
  promotionContentRelations,
};
