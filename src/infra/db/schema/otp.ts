import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { otpUsage } from './enum';

export const otps = pgTable('otps', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id'),
  usage: otpUsage('usage').notNull(),
  code: text('code').notNull(),
  expires: timestamp('expires_at', {
    mode: 'date',
    withTimezone: true,
  }).notNull(),
  createdAt: timestamp('created_at', { mode: 'date', withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const otpsRelations = relations(otps, ({ many }) => ({}));

export const otpDbSchemas = {
  // Entities
  otps,

  // Relations
  otpsRelations,
};
