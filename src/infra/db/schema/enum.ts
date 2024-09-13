import { pgEnum } from 'drizzle-orm/pg-core';

export const discountType = pgEnum('discount_type', [
  'fixed_amount',
  'percent',
]);

export const userRole = pgEnum('user_role', [
  'user',
  'teacher',
  'manager',
  'admin',
]);

export const categoryAccessRole = pgEnum('category_access_role', [
  'user',
  'teacher',
  'manager',
  'admin',
  // Extended from user role
  'guest',
  'purchased_user',
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

export const productUiContentType = pgEnum('product_ui_content_type', [
  'main-banner',
  'target-description',
  'tag',
]);
