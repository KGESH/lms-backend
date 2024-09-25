import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { fileType } from './enum';
import { relations } from 'drizzle-orm';
import { courseProductSnapshots } from './course';
import { ebookProductSnapshots } from './ebook';

export const files = pgTable('files', {
  id: uuid('id').primaryKey().defaultRandom(),
  url: text('url').notNull(),
  type: fileType('type').notNull(),
  metadata: text('metadata'),
  createdAt: timestamp('created_at', { mode: 'date', withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const filesRelations = relations(files, ({ many }) => ({
  courseProductSnapshots: many(courseProductSnapshots),
  ebookProductSnapshots: many(ebookProductSnapshots),
}));

export const fileDbSchemas = {
  // Entities
  files,

  // Relations
  filesRelations,
};
