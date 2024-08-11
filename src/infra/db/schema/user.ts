import { date, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  displayName: text('display_name').notNull(),
  email: text('email').unique().notNull(),
  password: text('password'),
  emailVerified: date('emailVerified'),
  image: text('image'),
});

export const userSessions = pgTable('user_sessions', {
  id: text('id').primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expiresAt: timestamp('expires_at', {
    withTimezone: true,
    mode: 'date',
  }).notNull(),
});

export const userAccounts = pgTable('user_accounts', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull(),
  // .references(() => users.id),
  providerId: text('provider_id').notNull(),
});

export const userInfos = pgTable('user_infos', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').unique().notNull(),
  // .references(() => users.id),
  name: text('name').notNull(),
  birthDate: text('birth_date').notNull(),
  gender: text('gender').notNull(),
  phoneNumber: text('phone_number').unique().notNull(),
  connectingInformation: text('connecting_information').notNull(),
  duplicationInformation: text('duplication_information').notNull(),
});

export const usersRelations = relations(users, ({ one, many }) => ({
  session: one(userSessions),
  info: one(userInfos),
  accounts: many(userAccounts),
}));

export const userInfosRelations = relations(userInfos, ({ one }) => ({
  user: one(users, {
    fields: [userInfos.userId],
    references: [users.id],
  }),
}));

export const userAccountsRelations = relations(userAccounts, ({ one }) => ({
  user: one(users, {
    fields: [userAccounts.userId],
    references: [users.id],
  }),
}));

export const userDbSchemas = {
  // Entities
  users,
  userSessions,
  userAccounts,
  userInfos,
  // Relations
  usersRelations,
  userInfosRelations,
  userAccountsRelations,
};
