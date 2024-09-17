import { Uuid } from '@src/shared/types/primitive';

type CouponCriteriaType = 'all' | 'category' | 'teacher' | 'course' | 'ebook';

/**
 * 쿠폰 적용 조건 Base
 */
export type ICouponCriteria = {
  /**
   * 쿠폰 적용 조건 ID
   */
  id: Uuid;

  /**
   * 쿠폰 ID
   */
  couponId: Uuid;

  /**
   * 쿠폰 적용 조건 타입
   */
  type: CouponCriteriaType;

  /**
   * 쿠폰 적용 조건 필터링 방식
   */
  direction: 'include' | 'exclude';
};

export type ICouponCategoryCriteria = ICouponCriteria & {
  categoryId: Uuid;
};

export type ICouponTeacherCriteria = ICouponCriteria & {
  teacherId: Uuid;
};

export type ICouponCourseCriteria = ICouponCriteria & {
  courseId: Uuid;
};

export type ICouponEbookCriteria = ICouponCriteria & {
  ebookId: Uuid;
};
