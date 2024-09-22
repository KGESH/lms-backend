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
  'repeat_timer',
  'banner',
  'marketing_banner',
]);

export const uiCarouselType = pgEnum('ui_carousel_type', [
  'carousel.main_banner',
  'carousel.review',
  'carousel.product',
]);

export const lessonContentType = pgEnum('lesson_content_type', [
  'video',
  'image',
  'text',
  'file',
]);

export const uiCarouselContentsType = pgEnum('ui_carousel_contents_type', [
  'image',
  'video',
]);

export const productUiContentType = pgEnum('product_ui_content_type', [
  'main_banner',
  'target_description',
  'tag',
]);

export const couponCriteriaType = pgEnum('coupon_criteria_type', [
  'all',
  'category',
  'teacher',
  'course',
  'ebook',
]);

export const couponDirection = pgEnum('coupon_direction', [
  'include',
  'exclude',
]);
