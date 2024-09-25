import { relations } from 'drizzle-orm';
import { AnyPgColumn, pgTable, text, uuid, boolean } from 'drizzle-orm/pg-core';
import { decimal, integer, timestamp } from 'drizzle-orm/pg-core';
import { discountType, lessonContentType, productUiContentType } from './enum';
import { teachers } from './teacher';
import { ebookOrders } from './order';
import { users } from './user';
import { files } from './file';

export const ebookCategories = pgTable('ebook_categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  parentId: uuid('parent_id').references(
    (): AnyPgColumn => ebookCategories.id,
    {
      onDelete: 'cascade',
    },
  ),
  name: text('name').notNull(),
  description: text('description'),
});

export const ebooks = pgTable('ebooks', {
  id: uuid('id').primaryKey().defaultRandom(),
  teacherId: uuid('teacher_id').notNull(),
  categoryId: uuid('category_id').notNull(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  createdAt: timestamp('created_at', { mode: 'date', withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'date', withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const ebookContents = pgTable('ebook_contents', {
  id: uuid('id').primaryKey().defaultRandom(),
  ebookId: uuid('ebook_id').notNull(),
  title: text('title').notNull(),
  description: text('description'),
  contentType: lessonContentType('content_type').notNull(),
  url: text('url'),
  metadata: text('metadata'),
  sequence: integer('sequence'),
  createdAt: timestamp('created_at', { mode: 'date', withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'date', withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const ebookProducts = pgTable('ebook_products', {
  id: uuid('id').primaryKey().defaultRandom(),
  ebookId: uuid('ebook_id').notNull(),
  createdAt: timestamp('created_at', { mode: 'date', withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const ebookProductSnapshots = pgTable('ebook_product_snapshots', {
  id: uuid('id').primaryKey().defaultRandom(),
  productId: uuid('product_id').notNull(),
  thumbnailId: uuid('thumbnail_id')
    .notNull()
    .references(() => files.id),
  title: text('title').notNull(),
  description: text('description'),
  createdAt: timestamp('created_at', { mode: 'date', withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'date', withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  deletedAt: timestamp('deleted_at', { mode: 'date', withTimezone: true }),
});

export const ebookProductSnapshotPricing = pgTable(
  'ebook_product_snapshot_pricing',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    productSnapshotId: uuid('product_snapshot_id').notNull(),
    amount: decimal('amount').notNull(),
  },
);

export const ebookProductSnapshotDiscounts = pgTable(
  'ebook_product_snapshot_discounts',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    productSnapshotId: uuid('product_snapshot_id').notNull(),
    enabled: boolean('enabled').notNull(),
    discountType: discountType('discount_type').notNull(),
    value: decimal('value').notNull(),
    validFrom: timestamp('valid_from', { mode: 'date', withTimezone: true }),
    validTo: timestamp('valid_to', { mode: 'date', withTimezone: true }),
  },
);

export const ebookProductSnapshotAnnouncements = pgTable(
  'ebook_product_snapshot_announcements',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    productSnapshotId: uuid('product_snapshot_id').notNull(),
    richTextContent: text('rich_text_content').notNull(),
  },
);

export const ebookProductSnapshotRefundPolicies = pgTable(
  'ebook_product_snapshot_refund_policies',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    productSnapshotId: uuid('product_snapshot_id').notNull(),
    richTextContent: text('rich_text_content').notNull(),
  },
);

export const ebookProductSnapshotContents = pgTable(
  'ebook_product_snapshot_contents',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    productSnapshotId: uuid('product_snapshot_id').notNull(),
    richTextContent: text('rich_text_content').notNull(),
  },
);

export const ebookProductSnapshotUiContents = pgTable(
  'ebook_product_snapshot_ui_contents',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    productSnapshotId: uuid('product_snapshot_id').notNull(),
    type: productUiContentType('type').notNull(),
    content: text('content').notNull(),
    description: text('description'),
    sequence: integer('sequence'),
    url: text('url'),
    metadata: text('metadata'),
  },
);

export const ebookEnrollments = pgTable('ebook_enrollments', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull(),
  ebookId: uuid('ebook_id').notNull(),
  createdAt: timestamp('created_at', {
    mode: 'date',
    withTimezone: true,
  })
    .notNull()
    .defaultNow(),
});

export const ebookCategoriesRelations = relations(
  ebookCategories,
  ({ one, many }) => ({
    parent: one(ebookCategories, {
      fields: [ebookCategories.parentId],
      references: [ebookCategories.id],
      relationName: 'ebook_categories_relation',
    }),
    children: many(ebookCategories, {
      relationName: 'ebook_categories_relation',
    }),
    ebooks: many(ebooks),
  }),
);

export const ebooksRelations = relations(ebooks, ({ one, many }) => ({
  teacher: one(teachers, {
    fields: [ebooks.teacherId],
    references: [teachers.id],
  }),
  category: one(ebookCategories, {
    fields: [ebooks.categoryId],
    references: [ebookCategories.id],
  }),
  contents: many(ebookContents),
  products: one(ebookProducts),
  enrollments: many(ebookEnrollments),
}));

export const ebookContentsRelations = relations(ebookContents, ({ one }) => ({
  ebook: one(ebooks, {
    fields: [ebookContents.ebookId],
    references: [ebooks.id],
  }),
}));

export const ebookProductsRelations = relations(
  ebookProducts,
  ({ one, many }) => ({
    ebook: one(ebooks, {
      fields: [ebookProducts.ebookId],
      references: [ebooks.id],
    }),
    snapshots: many(ebookProductSnapshots),
  }),
);

export const ebookProductSnapshotsRelations = relations(
  ebookProductSnapshots,
  ({ one, many }) => ({
    product: one(ebookProducts, {
      fields: [ebookProductSnapshots.productId],
      references: [ebookProducts.id],
    }),
    thumbnail: one(files, {
      fields: [ebookProductSnapshots.thumbnailId],
      references: [files.id],
    }),
    announcement: one(ebookProductSnapshotAnnouncements),
    refundPolicy: one(ebookProductSnapshotRefundPolicies),
    content: one(ebookProductSnapshotContents),
    pricing: one(ebookProductSnapshotPricing),
    discount: one(ebookProductSnapshotDiscounts),
    ebookOrders: many(ebookOrders),
    uiContents: many(ebookProductSnapshotUiContents),
  }),
);

export const ebookProductSnapshotAnnouncementsRelations = relations(
  ebookProductSnapshotAnnouncements,
  ({ one }) => ({
    productSnapshot: one(ebookProductSnapshots, {
      fields: [ebookProductSnapshotAnnouncements.productSnapshotId],
      references: [ebookProductSnapshots.id],
    }),
  }),
);

export const ebookProductSnapshotRefundPoliciesRelations = relations(
  ebookProductSnapshotRefundPolicies,
  ({ one }) => ({
    productSnapshot: one(ebookProductSnapshots, {
      fields: [ebookProductSnapshotRefundPolicies.productSnapshotId],
      references: [ebookProductSnapshots.id],
    }),
  }),
);

export const ebookProductSnapshotContentsRelations = relations(
  ebookProductSnapshotContents,
  ({ one }) => ({
    productSnapshot: one(ebookProductSnapshots, {
      fields: [ebookProductSnapshotContents.productSnapshotId],
      references: [ebookProductSnapshots.id],
    }),
  }),
);

export const ebookProductSnapshotPricingRelations = relations(
  ebookProductSnapshotPricing,
  ({ one }) => ({
    productSnapshot: one(ebookProductSnapshots, {
      fields: [ebookProductSnapshotPricing.productSnapshotId],
      references: [ebookProductSnapshots.id],
    }),
  }),
);

export const ebookProductSnapshotDiscountsRelations = relations(
  ebookProductSnapshotDiscounts,
  ({ one }) => ({
    productSnapshot: one(ebookProductSnapshots, {
      fields: [ebookProductSnapshotDiscounts.productSnapshotId],
      references: [ebookProductSnapshots.id],
    }),
  }),
);

export const ebookEnrollmentsRelations = relations(
  ebookEnrollments,
  ({ one }) => ({
    user: one(users, {
      fields: [ebookEnrollments.userId],
      references: [users.id],
    }),
    ebook: one(ebooks, {
      fields: [ebookEnrollments.ebookId],
      references: [ebooks.id],
    }),
  }),
);

export const ebookProductSnapshotUiContentsRelations = relations(
  ebookProductSnapshotUiContents,
  ({ one }) => ({
    productSnapshot: one(ebookProductSnapshots, {
      fields: [ebookProductSnapshotUiContents.productSnapshotId],
      references: [ebookProductSnapshots.id],
    }),
  }),
);

export const ebookDbSchema = {
  // Entities
  ebookCategories,
  ebooks,
  ebookContents,
  ebookProducts,
  ebookProductSnapshots,
  ebookProductSnapshotPricing,
  ebookProductSnapshotDiscounts,
  ebookProductSnapshotAnnouncements,
  ebookProductSnapshotRefundPolicies,
  ebookProductSnapshotContents,
  ebookProductSnapshotUiContents,
  ebookEnrollments,

  // Relations
  ebookCategoriesRelations,
  ebooksRelations,
  ebookContentsRelations,
  ebookProductsRelations,
  ebookProductSnapshotsRelations,
  ebookProductSnapshotPricingRelations,
  ebookProductSnapshotDiscountsRelations,
  ebookProductSnapshotAnnouncementsRelations,
  ebookProductSnapshotRefundPoliciesRelations,
  ebookProductSnapshotContentsRelations,
  ebookProductSnapshotUiContentsRelations,
  ebookEnrollmentsRelations,
};
