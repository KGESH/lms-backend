import { date, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { authProvider, userRole } from './enum';
import { teachers } from './teacher';
import { relations } from 'drizzle-orm';
import { reviewReplies, reviews } from './review';
import { orders } from './order';
import { ebookEnrollments } from './ebook';
import { courseEnrollments } from './course';
import { posts } from './post';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  displayName: text('display_name').notNull(),
  email: text('email').unique().notNull(),
  password: text('password'),
  emailVerified: date('emailVerified'),
  role: userRole('role').notNull().default('user'),
  image: text('image'),
  createdAt: timestamp('created_at', { mode: 'date', withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'date', withTimezone: true })
    .notNull()
    .defaultNow(),
  deletedAt: timestamp('deleted_at', { mode: 'date', withTimezone: true }),
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
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  providerType: authProvider('provider_type').notNull(),
  providerId: text('provider_id'),
});

export const userInfos = pgTable('user_infos', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .unique()
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  birthDate: text('birth_date'),
  gender: text('gender'),
  phoneNumber: text('phone_number').unique(),
  connectingInformation: text('connecting_information'),
  duplicationInformation: text('duplication_information'),
});

export const usersRelations = relations(users, ({ one, many }) => ({
  session: one(userSessions),
  info: one(userInfos),
  accounts: one(userAccounts),
  reviews: many(reviews),
  reviewComments: many(reviewReplies),
  orders: many(orders),
  coursesEnrollments: many(courseEnrollments),
  ebookEnrollments: many(ebookEnrollments),
  posts: many(posts),
}));

export const userSessionsRelations = relations(userSessions, ({ one }) => ({
  user: one(users, {
    fields: [userSessions.userId],
    references: [users.id],
  }),
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
  teachers,

  // Relations
  usersRelations,
  userSessionsRelations,
  userInfosRelations,
  userAccountsRelations,
};
