import { pgTable, uniqueIndex, uuid } from 'drizzle-orm/pg-core';
import { users } from './user';
import { relations } from 'drizzle-orm';
import { courses } from './course';
import { ebooks } from './ebook';

export const teachers = pgTable(
  'teachers',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
  },
  (table) => ({
    userIdIdx: uniqueIndex('idx_teachers_user_id').on(table.userId),
  }),
);

export const teachersRelations = relations(teachers, ({ one, many }) => ({
  account: one(users, {
    fields: [teachers.userId],
    references: [users.id],
  }),
  courses: many(courses),
  ebooks: many(ebooks),
}));

export const teacherDbSchema = {
  // Entities
  teachers,

  // Relations
  teachersRelations,
};
