import { pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

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
  gender: text('gender'),
  birthDate: text('birth_date'),
  phoneNumber: text('phone_number').unique(),
  connectingInformation: text('connecting_information'),
  duplicationInformation: text('duplication_information'),
});

export const teachersRelations = relations(teachers, ({ one }) => ({
  info: one(teacherInfos),
}));

export const teacherInfosRelations = relations(teacherInfos, ({ one }) => ({
  teacher: one(teachers, {
    fields: [teacherInfos.teacherId],
    references: [teachers.id],
  }),
}));

export const teacherDbSchema = {
  // Entities
  teachers,
  teacherInfos,
  // Relations
  teachersRelations,
  teacherInfosRelations,
};
