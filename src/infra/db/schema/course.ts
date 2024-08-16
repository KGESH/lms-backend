import {
  timestamp,
  decimal,
  integer,
  pgTable,
  text,
  uuid,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { discountType } from './enum';
import { teachers } from './user';

export const courseCategories = pgTable('course_categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  parentId: uuid('parent_id'),
  name: text('name').notNull(),
  description: text('description'),
});

export const courses = pgTable('courses', {
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

export const chapters = pgTable('chapters', {
  id: uuid('id').primaryKey().defaultRandom(),
  courseId: uuid('course_id').notNull(),
  title: text('title').notNull(),
  description: text('description'),
  sequence: integer('sequence').notNull(),
});

export const lessons = pgTable('lessons', {
  id: uuid('id').primaryKey().defaultRandom(),
  chapterId: uuid('chapter_id').notNull(),
  title: text('title').notNull(),
  description: text('description'),
  sequence: integer('sequence').notNull(),
});

export const lessonContents = pgTable('lesson_contents', {
  id: uuid('id').primaryKey().defaultRandom(),
  lessonId: uuid('lesson_id').notNull(),
  title: text('title').notNull(),
  description: text('description'),
  contentType: text('content_type').notNull(),
  url: text('url').notNull(),
  metadata: text('metadata'),
});

export const courseProducts = pgTable('course_products', {
  id: uuid('id').primaryKey().defaultRandom(),
  courseId: uuid('course_id').notNull(),
});

export const courseProductSnapshots = pgTable('course_product_snapshots', {
  id: uuid('id').primaryKey().defaultRandom(),
  courseProductId: uuid('course_product_id').notNull(),
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

export const courseProductSnapshotPricing = pgTable(
  'course_product_snapshot_pricing',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    courseProductSnapshotId: uuid('course_product_snapshot_id').notNull(),
    amount: decimal('amount').notNull(),
  },
);

export const courseProductSnapshotDiscounts = pgTable(
  'course_product_snapshot_discounts',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    courseProductSnapshotId: uuid('course_product_snapshot_id').notNull(),
    discountType: discountType('discount_type').notNull(),
    value: decimal('value').notNull(),
    validFrom: timestamp('valid_from', { mode: 'date', withTimezone: true }),
    validTo: timestamp('valid_to', { mode: 'date', withTimezone: true }),
  },
);

export const courseProductSnapshotContents = pgTable(
  'course_product_snapshot_contents',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    courseProductSnapshotId: uuid('course_product_snapshot_id').notNull(),
    richTextContent: text('rich_text_content').notNull(),
  },
);

export const courseCategoriesRelations = relations(
  courseCategories,
  ({ one, many }) => ({
    parent: one(courseCategories, {
      fields: [courseCategories.parentId],
      references: [courseCategories.id],
      relationName: 'course_categories_relation',
    }),
    children: many(courseCategories, {
      relationName: 'course_categories_relation',
    }),
    courses: many(courses),
  }),
);

export const coursesRelations = relations(courses, ({ one, many }) => ({
  teacher: one(teachers, {
    fields: [courses.teacherId],
    references: [teachers.id],
  }),
  category: one(courseCategories, {
    fields: [courses.categoryId],
    references: [courseCategories.id],
  }),
  chapters: many(chapters),
  products: one(courseProducts),
}));

export const courseProductsRelations = relations(
  courseProducts,
  ({ one, many }) => ({
    course: one(courses, {
      fields: [courseProducts.courseId],
      references: [courses.id],
    }),
    snapshots: many(courseProductSnapshots),
  }),
);

export const courseProductSnapshotsRelations = relations(
  courseProductSnapshots,
  ({ one }) => ({
    product: one(courseProducts, {
      fields: [courseProductSnapshots.courseProductId],
      references: [courseProducts.id],
    }),
    content: one(courseProductSnapshotContents),
    pricing: one(courseProductSnapshotPricing),
    discounts: one(courseProductSnapshotDiscounts),
  }),
);

export const courseProductSnapshotContentsRelations = relations(
  courseProductSnapshotContents,
  ({ one }) => ({
    productSnapshot: one(courseProductSnapshots, {
      fields: [courseProductSnapshotContents.courseProductSnapshotId],
      references: [courseProductSnapshots.id],
    }),
  }),
);

export const courseProductSnapshotPricingRelations = relations(
  courseProductSnapshotPricing,
  ({ one }) => ({
    productSnapshot: one(courseProductSnapshots, {
      fields: [courseProductSnapshotPricing.courseProductSnapshotId],
      references: [courseProductSnapshots.id],
    }),
  }),
);

export const courseProductSnapshotDiscountsRelations = relations(
  courseProductSnapshotDiscounts,
  ({ one }) => ({
    productSnapshot: one(courseProductSnapshots, {
      fields: [courseProductSnapshotDiscounts.courseProductSnapshotId],
      references: [courseProductSnapshots.id],
    }),
  }),
);

export const chaptersRelations = relations(chapters, ({ one, many }) => ({
  course: one(courses, {
    fields: [chapters.courseId],
    references: [courses.id],
  }),
  lessons: many(lessons),
}));

export const lessonsRelations = relations(lessons, ({ one, many }) => ({
  chapter: one(chapters, {
    fields: [lessons.chapterId],
    references: [chapters.id],
  }),
  lessonContents: many(lessonContents),
}));

export const lessonContentsRelations = relations(lessonContents, ({ one }) => ({
  lesson: one(lessons, {
    fields: [lessonContents.lessonId],
    references: [lessons.id],
  }),
}));

export const courseDbSchemas = {
  // Entities
  courseCategories,
  courses,
  chapters,
  lessons,
  lessonContents,
  courseProducts,
  courseProductSnapshots,
  courseProductSnapshotPricing,
  courseProductSnapshotDiscounts,
  courseProductSnapshotContents,

  // Relations
  courseCategoriesRelations,
  coursesRelations,
  chaptersRelations,
  lessonsRelations,
  lessonContentsRelations,
  courseProductsRelations,
  courseProductSnapshotsRelations,
  courseProductSnapshotPricingRelations,
  courseProductSnapshotDiscountsRelations,
  courseProductSnapshotContentsRelations,
};
