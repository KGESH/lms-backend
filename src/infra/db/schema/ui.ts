import {
  index,
  integer,
  pgTable,
  real,
  text,
  json,
  uniqueIndex,
  uuid,
  timestamp,
} from 'drizzle-orm/pg-core';
import {
  uiCarouselContentsType,
  uiCarouselType,
  uiCategory,
  uiCraftStatus,
} from './enum';
import { relations } from 'drizzle-orm';

export const uiComponents = pgTable(
  'ui_components',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    category: uiCategory('category').notNull(),
    name: text('name').notNull(),
    path: text('path').notNull(),
    sequence: integer('sequence').notNull(),
    description: text('description'),
  },
  (table) => ({
    nameIdx: uniqueIndex('idx_ui_components_name').on(table.name),
    pathIdx: index('idx_ui_components_path').on(table.path),
  }),
);

export const uiRepeatTimers = pgTable(
  'ui_repeat_timers',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    uiComponentId: uuid('ui_component_id')
      .notNull()
      .references(() => uiComponents.id, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    description: text('description'),
    repeatMinutes: integer('repeat_minutes').notNull(),
    buttonLabel: text('button_label'),
    buttonHref: text('button_href'),
  },
  (table) => ({
    uiComponentIdIdx: uniqueIndex('idx_ui_repeat_timers_ui_component_id').on(
      table.uiComponentId,
    ),
  }),
);

export const uiBanners = pgTable(
  'ui_banners',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    uiComponentId: uuid('ui_component_id')
      .notNull()
      .references(() => uiComponents.id, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    description: text('description'),
    linkUrl: text('link_url'),
  },
  (table) => ({
    uiComponentIdIdx: uniqueIndex('idx_ui_banners_ui_component_id').on(
      table.uiComponentId,
    ),
  }),
);

export const uiMarketingBanners = pgTable(
  'ui_marketing_banners',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    uiComponentId: uuid('ui_component_id')
      .notNull()
      .references(() => uiComponents.id, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    description: text('description'),
    linkUrl: text('link_url'),
  },
  (table) => ({
    uiComponentIdIdx: uniqueIndex(
      'idx_ui_marketing_banners_ui_component_id',
    ).on(table.uiComponentId),
  }),
);

export const uiPopups = pgTable(
  'ui_popups',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    uiComponentId: uuid('ui_component_id')
      .notNull()
      .references(() => uiComponents.id, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    description: text('description'),
    metadata: text('metadata'),
    json: json('json').notNull().$type<Record<string, unknown>>(),
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
    uiComponentIdIdx: uniqueIndex('idx_ui_popups_ui_component_id').on(
      table.uiComponentId,
    ),
  }),
);

export const uiCarousels = pgTable(
  'ui_carousels',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    uiComponentId: uuid('ui_component_id')
      .notNull()
      .references(() => uiComponents.id, { onDelete: 'cascade' }),
    carouselType: uiCarouselType('carousel_type').notNull(),
    title: text('title').notNull(),
    description: text('description'),
  },
  (table) => ({
    uiComponentIdIdx: uniqueIndex('idx_ui_carousels_ui_component_id').on(
      table.uiComponentId,
    ),
  }),
);

export const uiCarouselContents = pgTable(
  'ui_carousel_contents',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    uiCarouselId: uuid('ui_carousel_id')
      .notNull()
      .references(() => uiCarousels.id, { onDelete: 'cascade' }),
    type: uiCarouselContentsType('type').notNull(),
    sequence: integer('sequence').notNull(),
    title: text('title').notNull(),
    description: text('description'),
    contentUrl: text('content_url'),
    linkUrl: text('link_url'),
    metadata: text('metadata'),
  },
  (table) => ({
    uiCarouselIdIdx: index('idx_ui_carousel_contents_ui_carousel_id').on(
      table.uiCarouselId,
    ),
  }),
);

export const uiCarouselReviews = pgTable(
  'ui_carousel_reviews',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    uiCarouselId: uuid('ui_carousel_id')
      .notNull()
      .references(() => uiCarousels.id, { onDelete: 'cascade' }),
    sequence: integer('sequence').notNull(),
    title: text('title').notNull(),
    content: text('content').notNull(),
    rating: real('rating').notNull(), // 4bytes float
  },
  (table) => ({
    uiCarouselIdIdx: index('idx_ui_carousel_reviews_ui_carousel_id').on(
      table.uiCarouselId,
    ),
  }),
);

export const uiCraftComponents = pgTable('ui_craft_components', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  description: text('description'),
  serializedJson: text('serialized_json').notNull(),
  path: text('path').notNull(),
  status: uiCraftStatus('status').default('draft').notNull(),
  createdAt: timestamp('created_at', { mode: 'date', withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'date', withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  deletedAt: timestamp('deleted_at', { mode: 'date', withTimezone: true }),
});

export const uiComponentsRelations = relations(uiComponents, ({ one }) => ({
  repeatTimers: one(uiRepeatTimers),
  carousel: one(uiCarousels),
  banners: one(uiBanners),
  marketingBanners: one(uiMarketingBanners),
  popups: one(uiPopups),
}));

export const uiRepeatTimersRelations = relations(uiRepeatTimers, ({ one }) => ({
  uiComponent: one(uiComponents, {
    fields: [uiRepeatTimers.uiComponentId],
    references: [uiComponents.id],
  }),
}));

export const uiBannersRelations = relations(uiBanners, ({ one }) => ({
  uiComponent: one(uiComponents, {
    fields: [uiBanners.uiComponentId],
    references: [uiComponents.id],
  }),
}));

export const uiMarketingBannersRelations = relations(
  uiMarketingBanners,
  ({ one }) => ({
    uiComponent: one(uiComponents, {
      fields: [uiMarketingBanners.uiComponentId],
      references: [uiComponents.id],
    }),
  }),
);

export const uiPopupsRelations = relations(uiPopups, ({ one }) => ({
  uiComponent: one(uiComponents, {
    fields: [uiPopups.uiComponentId],
    references: [uiComponents.id],
  }),
}));

export const uiCarouselsRelations = relations(uiCarousels, ({ one, many }) => ({
  uiComponent: one(uiComponents, {
    fields: [uiCarousels.uiComponentId],
    references: [uiComponents.id],
  }),
  reviews: many(uiCarouselReviews),
  contents: many(uiCarouselContents),
}));

export const uiCarouselContentsRelations = relations(
  uiCarouselContents,
  ({ one }) => ({
    carousel: one(uiCarousels, {
      fields: [uiCarouselContents.uiCarouselId],
      references: [uiCarousels.id],
    }),
  }),
);

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
  uiBanners,
  uiMarketingBanners,
  uiCarousels,
  uiCarouselReviews,
  uiCarouselContents,
  uiCraftComponents,
  uiPopups,

  // Relations
  uiComponentsRelations,
  uiRepeatTimersRelations,
  uiBannersRelations,
  uiMarketingBannersRelations,
  uiCarouselsRelations,
  uiCarouselReviewsRelations,
  uiCarouselContentsRelations,
  uiPopupsRelations,
};
