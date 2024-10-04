import {
  AnyPgColumn,
  pgTable,
  text,
  uuid,
  unique,
  integer,
  timestamp,
  index,
} from 'drizzle-orm/pg-core';
import { categoryAccessRole } from './enum';
import { users } from './user';
import { relations } from 'drizzle-orm';

export const postCategories = pgTable(
  'post_categories',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    parentId: uuid('parent_id').references(
      (): AnyPgColumn => postCategories.id,
      {
        onDelete: 'cascade',
      },
    ),
    name: text('name').notNull(),
    description: text('description'),
  },
  (table) => ({
    parentIdx: index('idx_post_categories_parent_id').on(table.parentId),
  }),
);

export const postCategoryReadAccesses = pgTable(
  'post_category_read_accesses',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    categoryId: uuid('category_id')
      .notNull()
      .references(() => postCategories.id, { onDelete: 'cascade' }),
    role: categoryAccessRole('role').notNull(),
  },
  (table) => ({
    categoryIdIdx: index('idx_post_category_read_accesses_category_id').on(
      table.categoryId,
    ),
    access: unique().on(table.categoryId, table.role),
  }),
);

export const postCategoryWriteAccesses = pgTable(
  'post_category_write_accesses',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    categoryId: uuid('category_id')
      .notNull()
      .references(() => postCategories.id, { onDelete: 'cascade' }),
    role: categoryAccessRole('role').notNull(),
  },
  (table) => ({
    categoryIdIdx: index('idx_post_category_write_accesses_category_id').on(
      table.categoryId,
    ),
    access: unique().on(table.categoryId, table.role),
  }),
);

export const posts = pgTable(
  'posts',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references((): AnyPgColumn => users.id),
    categoryId: uuid('category_id')
      .notNull()
      .references((): AnyPgColumn => postCategories.id),
    viewCount: integer('view_count').notNull().default(0),
    createdAt: timestamp('created_at', { mode: 'date', withTimezone: true })
      .notNull()
      .defaultNow(),
    deletedAt: timestamp('deleted_at', { mode: 'date', withTimezone: true }),
  },
  (table) => ({
    userIdIdx: index('idx_posts_user_id').on(table.userId),
    categoryIdIdx: index('idx_posts_category_id').on(table.categoryId),
    createdAtIdx: index('idx_posts_created_at').on(table.createdAt),
  }),
);

export const postSnapshots = pgTable(
  'post_snapshots',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    postId: uuid('post_id')
      .notNull()
      .references((): AnyPgColumn => posts.id),
    title: text('title').notNull(),
    content: text('content').notNull(),
    createdAt: timestamp('created_at', { mode: 'date', withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    postIdIdx: index('idx_post_snapshots_post_id').on(table.postId),
    createdAtIdx: index('idx_post_snapshots_created_at').on(table.createdAt),
  }),
);

export const postLikes = pgTable(
  'post_likes',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    postId: uuid('post_id')
      .notNull()
      .references((): AnyPgColumn => posts.id),
    userId: uuid('user_id')
      .notNull()
      .references((): AnyPgColumn => users.id),
    createdAt: timestamp('created_at', { mode: 'date', withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    postIdIdx: index('idx_post_likes_post_id').on(table.postId),
    userIdIdx: index('idx_post_likes_user_id').on(table.userId),
    createdAtIdx: index('idx_post_likes_created_at').on(table.createdAt),
  }),
);

export const postComments = pgTable(
  'post_comments',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    postId: uuid('post_id')
      .notNull()
      .references((): AnyPgColumn => posts.id),
    userId: uuid('user_id')
      .notNull()
      .references((): AnyPgColumn => users.id),
    parentId: uuid('parent_id').references((): AnyPgColumn => postComments.id),
    createdAt: timestamp('created_at', { mode: 'date', withTimezone: true })
      .notNull()
      .defaultNow(),
    deletedAt: timestamp('deleted_at', { mode: 'date', withTimezone: true }),
  },
  (table) => ({
    postIdIdx: index('idx_post_comments_post_id').on(table.postId),
    userIdIdx: index('idx_post_comments_user_id').on(table.userId),
    parentIdIdx: index('idx_post_comments_parent_id').on(table.parentId),
    createdAtIdx: index('idx_post_comments_created_at').on(table.createdAt),
  }),
);

export const postCommentSnapshots = pgTable(
  'post_comment_snapshots',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    commentId: uuid('comment_id')
      .notNull()
      .references((): AnyPgColumn => postComments.id),
    content: text('comment').notNull(),
    createdAt: timestamp('created_at', { mode: 'date', withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    commentIdIdx: index('idx_post_comment_snapshots_comment_id').on(
      table.commentId,
    ),
    createdAtIdx: index('idx_post_comment_snapshots_created_at').on(
      table.createdAt,
    ),
  }),
);

export const postCommentLikes = pgTable(
  'post_comment_likes',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    commentId: uuid('comment_id')
      .notNull()
      .references((): AnyPgColumn => postComments.id),
    userId: uuid('user_id')
      .notNull()
      .references((): AnyPgColumn => users.id),
    createdAt: timestamp('created_at', { mode: 'date', withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    commentIdIdx: index('idx_post_comment_likes_comment_id').on(
      table.commentId,
    ),
    userIdIdx: index('idx_post_comment_likes_user_id').on(table.userId),
    createdAtIdx: index('idx_post_comment_likes_created_at').on(
      table.createdAt,
    ),
  }),
);

export const postCategoriesRelations = relations(
  postCategories,
  ({ one, many }) => ({
    parent: one(postCategories, {
      fields: [postCategories.parentId],
      references: [postCategories.id],
      relationName: 'post_categories_relation',
    }),
    children: many(postCategories, {
      relationName: 'post_categories_relation',
    }),
    posts: many(posts),
    readAccesses: many(postCategoryReadAccesses),
    writeAccesses: many(postCategoryWriteAccesses),
  }),
);

export const postCategoryReadAccessesRelations = relations(
  postCategoryReadAccesses,
  ({ one }) => ({
    category: one(postCategories, {
      fields: [postCategoryReadAccesses.categoryId],
      references: [postCategories.id],
    }),
  }),
);

export const postCategoryWriteAccessesRelations = relations(
  postCategoryWriteAccesses,
  ({ one }) => ({
    category: one(postCategories, {
      fields: [postCategoryWriteAccesses.categoryId],
      references: [postCategories.id],
    }),
  }),
);

export const postsRelations = relations(posts, ({ one, many }) => ({
  user: one(users, {
    fields: [posts.userId],
    references: [users.id],
  }),
  category: one(postCategories, {
    fields: [posts.categoryId],
    references: [postCategories.id],
  }),
  snapshots: many(postSnapshots),
  likes: many(postLikes),
  comments: many(postComments),
}));

export const postSnapshotsRelations = relations(postSnapshots, ({ one }) => ({
  post: one(posts, {
    fields: [postSnapshots.postId],
    references: [posts.id],
  }),
}));

export const postLikesRelations = relations(postLikes, ({ one }) => ({
  post: one(posts, {
    fields: [postLikes.postId],
    references: [posts.id],
  }),
  user: one(users, {
    fields: [postLikes.userId],
    references: [users.id],
  }),
}));

export const postCommentsRelations = relations(
  postComments,
  ({ one, many }) => ({
    post: one(posts, {
      fields: [postComments.postId],
      references: [posts.id],
    }),
    user: one(users, {
      fields: [postComments.userId],
      references: [users.id],
    }),
    parent: one(postComments, {
      fields: [postComments.parentId],
      references: [postComments.id],
      relationName: 'post_comments_relation',
    }),
    children: many(postComments, {
      relationName: 'post_comments_relation',
    }),
    snapshots: many(postCommentSnapshots),
    likes: many(postCommentLikes),
  }),
);

export const postCommentSnapshotsRelations = relations(
  postCommentSnapshots,
  ({ one }) => ({
    comment: one(postComments, {
      fields: [postCommentSnapshots.commentId],
      references: [postComments.id],
    }),
  }),
);

export const postCommentLikesRelations = relations(
  postCommentLikes,
  ({ one }) => ({
    comment: one(postComments, {
      fields: [postCommentLikes.commentId],
      references: [postComments.id],
    }),
    user: one(users, {
      fields: [postCommentLikes.userId],
      references: [users.id],
    }),
  }),
);

export const postDbSchemas = {
  // Entities
  postCategories,
  postCategoryReadAccesses,
  postCategoryWriteAccesses,
  posts,
  postSnapshots,
  postLikes,
  postComments,
  postCommentSnapshots,
  postCommentLikes,

  // Relations
  postCategoriesRelations,
  postCategoryReadAccessesRelations,
  postCategoryWriteAccessesRelations,
  postsRelations,
  postSnapshotsRelations,
  postLikesRelations,
  postCommentsRelations,
  postCommentSnapshotsRelations,
  postCommentLikesRelations,
};
