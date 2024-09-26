import { Uuid } from '@src/shared/types/primitive';
import { CouponDto } from '@src/v1/coupon/coupon.dto';
import { RequiredField } from '@src/shared/types/required-field';

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

export type CreateCouponAllCriteriaDto = Omit<
  CouponAllCriteriaDto,
  'id' | 'couponId'
>;

export type UpdateCouponAllCriteriaDto = Omit<
  RequiredField<Partial<CouponAllCriteriaDto>, 'type' | 'id'>,
  'couponId'
>;

export type DeleteCouponAllCriteriaDto = Pick<
  CouponAllCriteriaDto,
  'type' | 'id'
>;

export type CouponCategoryCriteriaDto = CouponCriteriaBaseDto & {
  /**
   * 쿠폰 적용 조건 타입
   */
  type: 'category';
  categoryId: Uuid;
};

export type CreateCouponCategoryCriteriaDto = Omit<
  CouponCategoryCriteriaDto,
  'id' | 'couponId'
>;

export type UpdateCouponCategoryCriteriaDto = Omit<
  RequiredField<Partial<CouponCategoryCriteriaDto>, 'type' | 'id'>,
  'couponId'
>;

export type DeleteCouponCategoryCriteriaDto = Pick<
  CouponCategoryCriteriaDto,
  'type' | 'id'
>;

export type CouponTeacherCriteriaDto = CouponCriteriaBaseDto & {
  /**
   * 쿠폰 적용 조건 타입
   */
  type: 'teacher';
  teacherId: Uuid;
};

export type CreateCouponTeacherCriteriaDto = Omit<
  CouponTeacherCriteriaDto,
  'id' | 'couponId'
>;

export type UpdateCouponTeacherCriteriaDto = Omit<
  RequiredField<Partial<CouponTeacherCriteriaDto>, 'type' | 'id'>,
  'couponId'
>;

export type DeleteCouponTeacherCriteriaDto = Pick<
  CouponTeacherCriteriaDto,
  'type' | 'id'
>;

export type CouponCourseCriteriaDto = CouponCriteriaBaseDto & {
  /**
   * 쿠폰 적용 조건 타입
   */
  type: 'course';
  courseId: Uuid;
};

export type CreateCouponCourseCriteriaDto = Omit<
  CouponCourseCriteriaDto,
  'id' | 'couponId'
>;

export type UpdateCouponCourseCriteriaDto = Omit<
  RequiredField<Partial<CouponCourseCriteriaDto>, 'type' | 'id'>,
  'couponId'
>;

export type DeleteCouponCourseCriteriaDto = Pick<
  CouponCourseCriteriaDto,
  'type' | 'id'
>;

export type CouponEbookCriteriaDto = CouponCriteriaBaseDto & {
  /**
   * 쿠폰 적용 조건 타입
   */
  type: 'ebook';
  ebookId: Uuid;
};

export type CreateCouponEbookCriteriaDto = Omit<
  CouponEbookCriteriaDto,
  'id' | 'couponId'
>;

export type UpdateCouponEbookCriteriaDto = Omit<
  RequiredField<Partial<CouponEbookCriteriaDto>, 'type' | 'id'>,
  'couponId'
>;

export type DeleteCouponEbookCriteriaDto = Pick<
  CouponEbookCriteriaDto,
  'type' | 'id'
>;

export type CouponWithCriteriaDto = CouponDto & {
  couponAllCriteria: CouponAllCriteriaDto[];
  couponCategoryCriteria: CouponCategoryCriteriaDto[];
  couponTeacherCriteria: CouponTeacherCriteriaDto[];
  couponCourseCriteria: CouponCourseCriteriaDto[];
  couponEbookCriteria: CouponEbookCriteriaDto[];
};

export type DeleteCouponCriteriaDto =
  | DeleteCouponAllCriteriaDto
  | DeleteCouponCategoryCriteriaDto
  | DeleteCouponTeacherCriteriaDto
  | DeleteCouponCourseCriteriaDto
  | DeleteCouponEbookCriteriaDto;
