import {
  integer,
  pgEnum,
  pgTable,
  real,
  text,
  uuid,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const uiCategory = pgEnum('ui_categories', [
  'carousel',
  'repeat-timer',
  'banner',
  'marketing-banner',
]);

export const uiComponents = pgTable('ui_components', {
  id: uuid('id').primaryKey().defaultRandom(),
  category: uiCategory('category').notNull(),
  name: text('name').unique().notNull(),
  path: text('path').notNull(),
  sequence: integer('sequence').notNull(),
  description: text('description'),
});

export const uiRepeatTimers = pgTable('ui_repeat_timers', {
  id: uuid('id').primaryKey().defaultRandom(),
  uiComponentId: uuid('ui_component_id')
    .notNull()
    .references(() => uiComponents.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description'),
  repeatMinutes: integer('repeat_minutes').notNull(),
  buttonLabel: text('button_label'),
  buttonHref: text('button_href'),
});

export const uiCarouselType = pgEnum('ui_carousel_type', [
  'carousel.main-banner',
  'carousel.review',
  'carousel.product',
]);

export const uiCarousels = pgTable('ui_carousels', {
  id: uuid('id').primaryKey().defaultRandom(),
  uiComponentId: uuid('ui_component_id')
    .notNull()
    .references(() => uiComponents.id, { onDelete: 'cascade' }),
  carouselType: uiCarouselType('carousel_type').notNull(),
  title: text('title').notNull(),
  description: text('description'),
});

export const uiCarouselReviews = pgTable('ui_carousel_reviews', {
  id: uuid('id').primaryKey().defaultRandom(),
  uiCarouselId: uuid('ui_carousel_id')
    .notNull()
    .references(() => uiCarousels.id, { onDelete: 'cascade' }),
  sequence: integer('sequence').notNull(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  rating: real('rating').notNull(), // 4bytes float
});

export const uiComponentsRelations = relations(uiComponents, ({ many }) => ({
  repeatTimers: many(uiRepeatTimers),
  carousels: many(uiCarousels),
}));

export const uiRepeatTimersRelations = relations(uiRepeatTimers, ({ one }) => ({
  uiComponent: one(uiComponents, {
    fields: [uiRepeatTimers.uiComponentId],
    references: [uiComponents.id],
  }),
}));

export const uiCarouselsRelations = relations(uiCarousels, ({ one, many }) => ({
  uiComponent: one(uiComponents, {
    fields: [uiCarousels.uiComponentId],
    references: [uiComponents.id],
  }),
  reviews: many(uiCarouselReviews),
}));

export const uiCarouselReviewsRelations = relations(
  uiCarouselReviews,
  ({ one }) => ({
    carousel: one(uiCarousels, {
      fields: [uiCarouselReviews.uiCarouselId],
      references: [uiCarousels.id],
    }),
  }),
);

export const uiDbSchemas = {
  // Entities
  uiComponents,
  uiRepeatTimers,
  uiCarousels,
  uiCarouselReviews,
  // Relations
  uiComponentsRelations,
  uiRepeatTimersRelations,
  uiCarouselsRelations,
  uiCarouselReviewsRelations,
};
