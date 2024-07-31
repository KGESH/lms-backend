import {
  date,
  decimal,
  pgTable,
  text,
  uuid,
  integer,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  displayName: text('display_name').notNull(),
  email: text('email').unique().notNull(),
  password: text('password'),
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

export const teachers = pgTable('teachers', {
  id: uuid('id').primaryKey().defaultRandom(),
  displayName: text('display_name').notNull(),
  email: text('email').unique().notNull(),
  password: text('password'),
});

export const teacherInfos = pgTable('teacher_infos', {
  id: uuid('id').primaryKey().defaultRandom(),
  teacherId: uuid('teacher_id').unique().notNull(),
  name: text('name').notNull(),
  gender: text('gender').notNull(),
  birthDate: text('birth_date').notNull(),
  phoneNumber: text('phone_number').unique().notNull(),
  connectingInformation: text('connecting_information').notNull(),
  duplicationInformation: text('duplication_information').notNull(),
});

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

export const usersRelations = relations(users, ({ one, many }) => ({
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

export const teachersRelations = relations(teachers, ({ one }) => ({
  info: one(teacherInfos),
}));

export const teacherInfosRelations = relations(teacherInfos, ({ one }) => ({
  teacher: one(teachers, {
    fields: [teacherInfos.teacherId],
    references: [teachers.id],
  }),
}));

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

export const dbSchema = {
  users,
  userAccounts,
  userInfos,
  usersRelations,
  userInfosRelations,
  userAccountsRelations,

  teachers,
  teacherInfos,
  teachersRelations,
  teacherInfosRelations,

  courseCategories,
  courseCategoriesRelations,
  courses,
  coursesRelations,
  chapters,
  chaptersRelations,
  lessons,
  lessonsRelations,
  lessonContents,
  coursePricing,
  coursePricingRelations,
  courseDiscounts,
  courseDiscountsRelations,
};
