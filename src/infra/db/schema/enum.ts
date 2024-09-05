import { pgEnum } from 'drizzle-orm/pg-core';

export const discountType = pgEnum('discount_type', [
  'fixed_amount',
  'percent',
]);

export const userRole = pgEnum('user_role', [
  'guest',
  'user',
  'teacher',
  'manager',
  'admin',
]);

export const authProvider = pgEnum('auth_provider', ['email', 'kakao']);

export const productType = pgEnum('product_type', ['course', 'ebook']);

export const uiCategory = pgEnum('ui_categories', [
  'carousel',
  'repeat-timer',
  'banner',
  'marketing-banner',
]);

export const uiCarouselType = pgEnum('ui_carousel_type', [
  'carousel.main-banner',
  'carousel.review',
  'carousel.product',
]);

export const lessonContentType = pgEnum('lesson_content_type', [
  'video',
  'image',
  'text',
  'file',
]);
