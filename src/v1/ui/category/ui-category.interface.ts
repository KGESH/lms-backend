export const UI_CATEGORY = {
  CAROUSE: 'carousel',
  REPEAT_TIMER: 'repeat-timer',
  BANNER: 'banner',
  MARKETING_BANNER: 'marketing-banner',
} as const;

export type UiCategory = (typeof UI_CATEGORY)[keyof typeof UI_CATEGORY];

export type UiCarousel = typeof UI_CATEGORY.CAROUSE;

export type UiRepeatTimer = typeof UI_CATEGORY.REPEAT_TIMER;

export type UiBanner = typeof UI_CATEGORY.BANNER;

export type UiMarketingBanner = typeof UI_CATEGORY.MARKETING_BANNER;

export const UI_CAROUSEL_TYPE = {
  MAIN_BANNER: 'carousel.main-banner',
  REVIEW: 'carousel.review',
  PRODUCT: 'carousel.product',
} as const;

export type UiCarouselType =
  (typeof UI_CAROUSEL_TYPE)[keyof typeof UI_CAROUSEL_TYPE];
