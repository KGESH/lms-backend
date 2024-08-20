import { pgTable, uuid } from 'drizzle-orm/pg-core';
import { users } from './user';
import { relations } from 'drizzle-orm';
import { courses } from './course';

export const teachers = pgTable('teachers', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .unique()
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
});

export const teachersRelations = relations(teachers, ({ one, many }) => ({
  account: one(users, {
    fields: [teachers.userId],
    references: [users.id],
  }),
  courses: many(courses),
}));

export const teacherDbSchema = {
  teachers,

  teachersRelations,
};
