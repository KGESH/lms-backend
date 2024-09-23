import {
  boolean,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { termType } from './enum';
import { users } from './user';

export const terms = pgTable('terms', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  type: termType('type').notNull(),
  createdAt: timestamp('created_at', { mode: 'date', withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'date', withTimezone: true })
    .notNull()
    .defaultNow(),
  deletedAt: timestamp('deleted_at', { mode: 'date', withTimezone: true }),
});

export const termSnapshots = pgTable('term_snapshots', {
  id: uuid('id').primaryKey().defaultRandom(),
  termId: uuid('term_id')
    .notNull()
    .references(() => terms.id),
  title: text('title').notNull(),
  description: text('description'),
  content: text('content').notNull(),
  updatedReason: text('updated_reason'),
  metadata: text('metadata'),
  createdAt: timestamp('created_at', { mode: 'date', withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const signupTerms = pgTable('signup_terms', {
  id: uuid('id').primaryKey().defaultRandom(),
  termId: uuid('term_id')
    .notNull()
    .references(() => terms.id),
  sequence: integer('sequence').notNull().unique(),
  createdAt: timestamp('created_at', { mode: 'date', withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const userTerms = pgTable('user_terms', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  termId: uuid('term_id')
    .notNull()
    .references(() => terms.id, { onDelete: 'cascade' }),
  agreed: boolean('agreed').notNull(),
  createdAt: timestamp('created_at', {
    mode: 'date',
    withTimezone: true,
  })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', {
    mode: 'date',
    withTimezone: true,
  })
    .notNull()
    .defaultNow(),
});

export const termsRelations = relations(terms, ({ many }) => ({
  snapshots: many(termSnapshots),
  signupTerms: many(signupTerms),
  userTerms: many(userTerms),
}));

export const termSnapshotsRelations = relations(termSnapshots, ({ one }) => ({
  term: one(terms, {
    fields: [termSnapshots.termId],
    references: [terms.id],
  }),
}));

export const signupTermsRelations = relations(signupTerms, ({ one }) => ({
  term: one(terms, {
    fields: [signupTerms.termId],
    references: [terms.id],
  }),
}));

export const userTermsRelations = relations(userTerms, ({ one }) => ({
  user: one(users, {
    fields: [userTerms.userId],
    references: [users.id],
  }),
  term: one(terms, {
    fields: [userTerms.termId],
    references: [terms.id],
  }),
}));

export const termDbSchema = {
  // Entities
  terms,
  termSnapshots,
  signupTerms,
  userTerms,

  // Relations
  termsRelations,
  termSnapshotsRelations,
  signupTermsRelations,
  userTermsRelations,
};
