import {
  AnyPgColumn,
  boolean,
  decimal,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';
import { discountType, lessonContentType, productUiContentType } from './enum';
import { relations } from 'drizzle-orm';
import { courseOrders } from './order';
import { teachers } from './teacher';
import { users } from './user';
import { files } from './file';

export const courseCategories = pgTable(
  'course_categories',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    parentId: uuid('parent_id').references(
      (): AnyPgColumn => courseCategories.id,
      { onDelete: 'cascade' },
    ),
    name: text('name').notNull(),
    description: text('description'),
  },
  (table) => ({
    parentIdx: index('idx_course_categories_parent_id').on(table.parentId),
  }),
);

export const courses = pgTable(
  'courses',
  {
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
  },
  (table) => ({
    teacherIdIdx: index('idx_courses_teacher_id').on(table.teacherId),
    categoryIdIdx: index('idx_courses_category_id').on(table.categoryId),
  }),
);

export const chapters = pgTable(
  'chapters',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    courseId: uuid('course_id').notNull(),
    title: text('title').notNull(),
    description: text('description'),
    sequence: integer('sequence').notNull(),
  },
  (table) => ({
    courseIdIdx: index('idx_chapters_course_id').on(table.courseId),
  }),
);

export const lessons = pgTable(
  'lessons',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    chapterId: uuid('chapter_id').notNull(),
    title: text('title').notNull(),
    description: text('description'),
    sequence: integer('sequence').notNull(),
  },
  (table) => ({
    chapterIdIdx: index('idx_lessons_chapter_id').on(table.chapterId),
  }),
);

export const lessonContents = pgTable(
  'lesson_contents',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    lessonId: uuid('lesson_id').notNull(),
    fileId: uuid('file_id').references(() => files.id),
    title: text('title').notNull(),
    description: text('description'),
    contentType: lessonContentType('content_type').notNull(),
    metadata: text('metadata'),
    sequence: integer('sequence'),
  },
  (table) => ({
    lessonIdIdx: index('idx_lesson_contents_lesson_id').on(table.lessonId),
    fileIdIdx: index('idx_lesson_contents_file_id').on(table.fileId),
  }),
);

export const lessonContentAccessHistory = pgTable(
  'lesson_content_access_history',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').notNull(),
    lessonContentId: uuid('lesson_content_id').notNull(),
    createdAt: timestamp('created_at', { mode: 'date', withTimezone: true })
      .notNull()
      .defaultNow(),
  },
);

export const courseEnrollments = pgTable(
  'course_enrollments',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    courseId: uuid('course_id').notNull(),
    createdAt: timestamp('created_at', {
      mode: 'date',
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),
    validUntil: timestamp('valid_until', {
      mode: 'date',
      withTimezone: true,
    }),
  },
  (table) => ({
    userIdIdx: index('idx_course_enrollments_user_id').on(table.userId),
    courseIdIdx: index('idx_course_enrollments_course_id').on(table.courseId),
  }),
);

export const courseEnrollmentProgresses = pgTable(
  'course_enrollment_progresses',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    enrollmentId: uuid('enrollment_id')
      .notNull()
      .references(() => courseEnrollments.id, { onDelete: 'cascade' }),
    lessonId: uuid('lesson_id')
      .notNull()
      .references(() => lessons.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at', {
      mode: 'date',
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    enrollmentLessonIdx: index(
      'idx_course_enrollment_progresses_enrollment_lesson',
    ).on(table.enrollmentId, table.lessonId),
  }),
);

export const courseCertificates = pgTable(
  'course_certificates',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    enrollmentId: uuid('enrollment_id').notNull(),
    createdAt: timestamp('created_at', {
      mode: 'date',
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    enrollmentIdx: index('idx_course_certificates_enrollment_id').on(
      table.enrollmentId,
    ),
  }),
);

export const courseProducts = pgTable(
  'course_products',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    courseId: uuid('course_id').notNull(),
    createdAt: timestamp('created_at', { mode: 'date', withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    courseIdIdx: index('idx_course_products_course_id').on(table.courseId),
  }),
);

export const courseProductSnapshots = pgTable(
  'course_product_snapshots',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    productId: uuid('product_id')
      .notNull()
      .references(() => courseProducts.id, { onDelete: 'cascade' }),
    thumbnailId: uuid('thumbnail_id')
      .notNull()
      .references(() => files.id),
    title: text('title').notNull(),
    description: text('description'),
    availableDays: integer('available_days'),
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
    productIdIdx: index('idx_course_product_snapshots_product_id').on(
      table.productId,
    ),
    thumbnailIdIdx: index('idx_course_product_snapshots_thumbnail_id').on(
      table.thumbnailId,
    ),
    createdAtIdx: index('idx_course_product_snapshots_created_at').on(
      table.createdAt,
    ),
  }),
);

export const courseProductSnapshotPricing = pgTable(
  'course_product_snapshot_pricing',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    productSnapshotId: uuid('product_snapshot_id').notNull(),
    amount: decimal('amount').notNull(),
  },
  (table) => ({
    productSnapshotIdIdx: index(
      'idx_course_product_snapshot_pricing_product_snapshot_id',
    ).on(table.productSnapshotId),
  }),
);

export const courseProductSnapshotDiscounts = pgTable(
  'course_product_snapshot_discounts',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    productSnapshotId: uuid('product_snapshot_id').notNull(),
    discountType: discountType('discount_type').notNull(),
    enabled: boolean('enabled').notNull(),
    value: decimal('value').notNull(),
    validFrom: timestamp('valid_from', { mode: 'date', withTimezone: true }),
    validTo: timestamp('valid_to', { mode: 'date', withTimezone: true }),
  },
  (table) => ({
    productSnapshotIdIdx: index(
      'idx_course_product_snapshot_discounts_product_snapshot_id',
    ).on(table.productSnapshotId),
  }),
);

export const courseProductSnapshotAnnouncements = pgTable(
  'course_product_snapshot_announcements',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    productSnapshotId: uuid('product_snapshot_id').notNull(),
    richTextContent: text('rich_text_content').notNull(),
  },
  (table) => ({
    productSnapshotIdIdx: index(
      'idx_course_product_snapshot_announcements_product_snapshot_id',
    ).on(table.productSnapshotId),
  }),
);

export const courseProductSnapshotRefundPolicies = pgTable(
  'course_product_snapshot_refund_policies',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    productSnapshotId: uuid('product_snapshot_id').notNull(),
    richTextContent: text('rich_text_content').notNull(),
  },
  (table) => ({
    productSnapshotIdIdx: index(
      'idx_course_product_snapshot_refund_policies_product_snapshot_id',
    ).on(table.productSnapshotId),
  }),
);

export const courseProductSnapshotContents = pgTable(
  'course_product_snapshot_contents',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    productSnapshotId: uuid('product_snapshot_id').notNull(),
    richTextContent: text('rich_text_content').notNull(),
  },
  (table) => ({
    productSnapshotIdIdx: index(
      'idx_course_product_snapshot_contents_product_snapshot_id',
    ).on(table.productSnapshotId),
  }),
);

export const courseProductSnapshotUiContents = pgTable(
  'course_product_snapshot_ui_contents',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    productSnapshotId: uuid('product_snapshot_id').notNull(),
    fileId: uuid('file_id').references(() => files.id),
    type: productUiContentType('type').notNull(),
    content: text('content').notNull(),
    description: text('description'),
    sequence: integer('sequence'),
    // url: text('url'),
    metadata: text('metadata'),
  },
  (table) => ({
    productSnapshotIdIdx: index(
      'idx_course_product_snapshot_ui_contents_product_snapshot_id',
    ).on(table.productSnapshotId),
    fileIdIndex: index('idx_course_product_snapshot_ui_contents_file_id').on(
      table.fileId,
    ),
  }),
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
  enrollments: many(courseEnrollments),
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
  ({ one, many }) => ({
    product: one(courseProducts, {
      fields: [courseProductSnapshots.productId],
      references: [courseProducts.id],
    }),
    thumbnail: one(files, {
      fields: [courseProductSnapshots.thumbnailId],
      references: [files.id],
    }),
    announcement: one(courseProductSnapshotAnnouncements),
    refundPolicy: one(courseProductSnapshotRefundPolicies),
    content: one(courseProductSnapshotContents),
    pricing: one(courseProductSnapshotPricing),
    discount: one(courseProductSnapshotDiscounts),
    courseOrders: many(courseOrders),
    uiContents: many(courseProductSnapshotUiContents),
  }),
);

export const courseProductSnapshotAnnouncementsRelations = relations(
  courseProductSnapshotAnnouncements,
  ({ one }) => ({
    productSnapshot: one(courseProductSnapshots, {
      fields: [courseProductSnapshotAnnouncements.productSnapshotId],
      references: [courseProductSnapshots.id],
    }),
  }),
);

export const courseProductSnapshotRefundPoliciesRelations = relations(
  courseProductSnapshotRefundPolicies,
  ({ one }) => ({
    productSnapshot: one(courseProductSnapshots, {
      fields: [courseProductSnapshotRefundPolicies.productSnapshotId],
      references: [courseProductSnapshots.id],
    }),
  }),
);

export const courseProductSnapshotContentsRelations = relations(
  courseProductSnapshotContents,
  ({ one }) => ({
    productSnapshot: one(courseProductSnapshots, {
      fields: [courseProductSnapshotContents.productSnapshotId],
      references: [courseProductSnapshots.id],
    }),
  }),
);

export const courseProductSnapshotPricingRelations = relations(
  courseProductSnapshotPricing,
  ({ one }) => ({
    productSnapshot: one(courseProductSnapshots, {
      fields: [courseProductSnapshotPricing.productSnapshotId],
      references: [courseProductSnapshots.id],
    }),
  }),
);

export const courseProductSnapshotDiscountsRelations = relations(
  courseProductSnapshotDiscounts,
  ({ one }) => ({
    productSnapshot: one(courseProductSnapshots, {
      fields: [courseProductSnapshotDiscounts.productSnapshotId],
      references: [courseProductSnapshots.id],
    }),
  }),
);

export const courseProductSnapshotUiContentsRelations = relations(
  courseProductSnapshotUiContents,
  ({ one }) => ({
    productSnapshot: one(courseProductSnapshots, {
      fields: [courseProductSnapshotUiContents.productSnapshotId],
      references: [courseProductSnapshots.id],
    }),
    file: one(files, {
      fields: [courseProductSnapshotUiContents.fileId],
      references: [files.id],
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
  completion: many(courseEnrollmentProgresses),
}));

export const lessonContentsRelations = relations(lessonContents, ({ one }) => ({
  lesson: one(lessons, {
    fields: [lessonContents.lessonId],
    references: [lessons.id],
  }),
  file: one(files, {
    fields: [lessonContents.fileId],
    references: [files.id],
  }),
}));

export const lessonContentAccessHistoryRelations = relations(
  lessonContentAccessHistory,
  ({ one }) => ({
    user: one(users, {
      fields: [lessonContentAccessHistory.userId],
      references: [users.id],
    }),
    lessonContent: one(lessonContents, {
      fields: [lessonContentAccessHistory.lessonContentId],
      references: [lessonContents.id],
    }),
  }),
);

export const courseEnrollmentsRelations = relations(
  courseEnrollments,
  ({ one, many }) => ({
    user: one(users, {
      fields: [courseEnrollments.userId],
      references: [users.id],
    }),
    course: one(courses, {
      fields: [courseEnrollments.courseId],
      references: [courses.id],
    }),
    certificate: one(courseCertificates),
    progresses: many(courseEnrollmentProgresses),
  }),
);

export const courseEnrollmentProgressesRelations = relations(
  courseEnrollmentProgresses,
  ({ one }) => ({
    enrollment: one(courseEnrollments, {
      fields: [courseEnrollmentProgresses.enrollmentId],
      references: [courseEnrollments.id],
    }),
    lesson: one(lessons, {
      fields: [courseEnrollmentProgresses.lessonId],
      references: [lessons.id],
    }),
  }),
);

export const courseCertificatesRelations = relations(
  courseCertificates,
  ({ one }) => ({
    enrollment: one(courseEnrollments, {
      fields: [courseCertificates.enrollmentId],
      references: [courseEnrollments.id],
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
  lessonContentAccessHistory,
  courseProducts,
  courseProductSnapshots,
  courseProductSnapshotContents,
  courseProductSnapshotAnnouncements,
  courseProductSnapshotRefundPolicies,
  courseProductSnapshotPricing,
  courseProductSnapshotDiscounts,
  courseProductSnapshotUiContents,
  courseEnrollments,
  courseEnrollmentProgresses,
  courseCertificates,

  // Relations
  courseCategoriesRelations,
  coursesRelations,
  chaptersRelations,
  lessonsRelations,
  lessonContentsRelations,
  lessonContentAccessHistoryRelations,
  courseProductsRelations,
  courseProductSnapshotsRelations,
  courseProductSnapshotContentsRelations,
  courseProductSnapshotAnnouncementsRelations,
  courseProductSnapshotRefundPoliciesRelations,
  courseProductSnapshotPricingRelations,
  courseProductSnapshotDiscountsRelations,
  courseProductSnapshotUiContentsRelations,
  courseEnrollmentsRelations,
  courseEnrollmentProgressesRelations,
  courseCertificatesRelations,
};
