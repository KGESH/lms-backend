import {
  index,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { policyType } from './enum';

export const policies = pgTable(
  'policies',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    type: policyType('type').notNull(),
    description: text('description'),
    createdAt: timestamp('created_at', { mode: 'date', withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'date', withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
    deletedAt: timestamp('deleted_at', { mode: 'date', withTimezone: true }),
  },
  (table) => ({
    typeIdx: uniqueIndex('idx_policies_type').on(table.type),
  }),
);

export const policySnapshots = pgTable(
  'policy_snapshots',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    policyId: uuid('policy_id')
      .notNull()
      .references(() => policies.id, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    description: text('description'),
    content: text('content').notNull(),
    updatedReason: text('updated_reason'),
    metadata: text('metadata'),
    createdAt: timestamp('created_at', { mode: 'date', withTimezone: true })
      .notNull()
      .defaultNow(),
    deletedAt: timestamp('deleted_at', { mode: 'date', withTimezone: true }),
  },
  (table) => ({
    policyIdIdx: index('idx_policy_snapshots_policy_id').on(table.policyId),
    createdAtIdx: index('idx_policy_snapshots_created_at').on(table.createdAt),
  }),
);

export const policiesRelations = relations(policies, ({ many }) => ({
  snapshots: many(policySnapshots),
}));

export const policySnapshotsRelations = relations(
  policySnapshots,
  ({ one }) => ({
    policy: one(policies, {
      fields: [policySnapshots.policyId],
      references: [policies.id],
    }),
  }),
);

export const policyDbSchema = {
  // Entities
  policies,
  policySnapshots,

  // Relations
  policiesRelations,
  policySnapshotsRelations,
};
