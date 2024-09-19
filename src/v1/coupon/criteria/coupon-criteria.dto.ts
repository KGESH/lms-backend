import { Uuid } from '@src/shared/types/primitive';
import { Optional } from '@src/shared/types/optional';
import { CouponDto } from '@src/v1/coupon/coupon.dto';

/**
 * 쿠폰 적용 조건 Base
 */
export type CouponCriteriaBaseDto = {
  /**
   * 쿠폰 적용 조건 ID
   */
  id: Uuid;

  /**
   * 쿠폰 ID
   */
  couponId: Uuid;

  /**
   * 쿠폰 적용 조건 필터링 방식
   */
  direction: 'include' | 'exclude';
};

export type CouponAllCriteriaDto = CouponCriteriaBaseDto & {
  /**
   * 쿠폰 적용 조건 타입
   */
  type: 'all';
};

export type CreateCouponAllCriteriaDto = Optional<CouponAllCriteriaDto, 'id'>;

export type CouponCategoryCriteriaDto = CouponCriteriaBaseDto & {
  /**
   * 쿠폰 적용 조건 타입
   */
  type: 'category';
  categoryId: Uuid;
};

export type CreateCouponCategoryCriteriaDto = Optional<
  CouponCategoryCriteriaDto,
  'id'
>;

export type CouponTeacherCriteriaDto = CouponCriteriaBaseDto & {
  /**
   * 쿠폰 적용 조건 타입
   */
  type: 'teacher';
  teacherId: Uuid;
};

export type CreateCouponTeacherCriteriaDto = Optional<
  CouponTeacherCriteriaDto,
  'id'
>;

export type CouponCourseCriteriaDto = CouponCriteriaBaseDto & {
  /**
   * 쿠폰 적용 조건 타입
   */
  type: 'course';
  courseId: Uuid;
};

export type CreateCouponCourseCriteriaDto = Optional<
  CouponCourseCriteriaDto,
  'id'
>;

export type CouponEbookCriteriaDto = CouponCriteriaBaseDto & {
  /**
   * 쿠폰 적용 조건 타입
   */
  type: 'ebook';
  ebookId: Uuid;
};

export type CreateCouponEbookCriteriaDto = Optional<
  CouponEbookCriteriaDto,
  'id'
>;

export type CouponCriteriaDto =
  | CouponAllCriteriaDto
  | CouponCategoryCriteriaDto
  | CouponTeacherCriteriaDto
  | CouponCourseCriteriaDto
  | CouponEbookCriteriaDto;

export type CouponCriteriaCreateDto =
  | CreateCouponAllCriteriaDto
  | CreateCouponCategoryCriteriaDto
  | CreateCouponTeacherCriteriaDto
  | CreateCouponCourseCriteriaDto
  | CreateCouponEbookCriteriaDto;

export type CouponWithCriteriaDto = CouponDto & {
  couponAllCriteria: CouponAllCriteriaDto[];
  couponCategoryCriteria: CouponCategoryCriteriaDto[];
  couponTeacherCriteria: CouponTeacherCriteriaDto[];
  couponCourseCriteria: CouponCourseCriteriaDto[];
  couponEbookCriteria: CouponEbookCriteriaDto[];
};
