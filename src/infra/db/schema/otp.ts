import {
  index,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { otpUsage } from './enum';

export const otps = pgTable(
  'otps',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    identifier: text('identifier').notNull(),
    usage: otpUsage('usage').notNull(),
    code: text('code').notNull(),
    expires: timestamp('expires_at', {
      mode: 'date',
      withTimezone: true,
    }).notNull(),
    createdAt: timestamp('created_at', { mode: 'date', withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    identifierUsage: unique().on(table.identifier, table.usage),
    createdAtIdx: index('idx_otps_created_at').on(table.createdAt),
  }),
);

export const otpsRelations = relations(otps, ({ many }) => ({}));

export const otpDbSchemas = {
  // Entities
  otps,

  // Relations
  otpsRelations,
};
