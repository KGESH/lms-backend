import {
  date,
  decimal,
  integer,
  pgTable,
  text,
  uuid,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { teachers } from './teacher';

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
  createdAt: date('created_at').notNull().defaultNow(),
  updatedAt: date('updated_at').notNull().defaultNow(),
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

export const coursePricing = pgTable('course_pricing', {
  id: uuid('id').primaryKey().defaultRandom(),
  courseId: uuid('course_id').notNull(),
  amount: decimal('amount').notNull(),
});

export const courseDiscounts = pgTable('course_discounts', {
  id: uuid('id').primaryKey().defaultRandom(),
  coursePricingId: uuid('course_pricing_id').notNull(),
  discountType: text('discount_type').notNull(),
  value: decimal('value').notNull(),
  validFrom: date('valid_from'),
  validTo: date('valid_to'),
});

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
  pricing: one(coursePricing),
  chapters: many(chapters),
}));

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
  contents: many(lessonContents),
}));

export const coursePricingRelations = relations(
  coursePricing,
  ({ one, many }) => ({
    course: one(courses, {
      fields: [coursePricing.courseId],
      references: [courses.id],
    }),
    discounts: many(courseDiscounts),
  }),
);

export const courseDiscountsRelations = relations(
  courseDiscounts,
  ({ one }) => ({
    pricing: one(coursePricing, {
      fields: [courseDiscounts.coursePricingId],
      references: [coursePricing.id],
    }),
  }),
);

export const courseDbSchemas = {
  // Entities
  courseCategories,
  courses,
  chapters,
  lessons,
  lessonContents,
  coursePricing,
  courseDiscounts,
  // Relations
  courseCategoriesRelations,
  coursesRelations,
  chaptersRelations,
  lessonsRelations,
  coursePricingRelations,
  courseDiscountsRelations,
};
