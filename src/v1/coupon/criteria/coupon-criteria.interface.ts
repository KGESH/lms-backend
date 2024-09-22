import { Uuid } from '@src/shared/types/primitive';
import { Optional } from '@src/shared/types/optional';
import { ICoupon } from '@src/v1/coupon/coupon.interface';
import { RequiredField } from '@src/shared/types/required-field';

/**
 * 쿠폰 적용 조건 Base
 */
export type ICouponCriteriaBase = {
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

export type ICouponAllCriteria = ICouponCriteriaBase & {
  /**
   * 쿠폰 적용 조건 타입
   */
  type: 'all';
};

export type ICouponAllCriteriaCreate = Optional<ICouponAllCriteria, 'id'>;

export type ICouponCategoryCriteria = ICouponCriteriaBase & {
  /**
   * 쿠폰 적용 조건 타입
   */
  type: 'category';
  categoryId: Uuid;
};

export type ICouponCategoryCriteriaCreate = Optional<
  ICouponCategoryCriteria,
  'id'
>;

export type ICouponTeacherCriteria = ICouponCriteriaBase & {
  /**
   * 쿠폰 적용 조건 타입
   */
  type: 'teacher';
  teacherId: Uuid;
};

export type ICouponTeacherCriteriaCreate = Optional<
  ICouponTeacherCriteria,
  'id'
>;

export type ICouponCourseCriteria = ICouponCriteriaBase & {
  /**
   * 쿠폰 적용 조건 타입
   */
  type: 'course';
  courseId: Uuid;
};

export type ICouponCourseCriteriaCreate = Optional<ICouponCourseCriteria, 'id'>;

export type ICouponEbookCriteria = ICouponCriteriaBase & {
  /**
   * 쿠폰 적용 조건 타입
   */
  type: 'ebook';
  ebookId: Uuid;
};

export type ICouponEbookCriteriaCreate = Optional<ICouponEbookCriteria, 'id'>;

export type ICouponCriteria =
  | ICouponAllCriteria
  | ICouponCategoryCriteria
  | ICouponTeacherCriteria
  | ICouponCourseCriteria
  | ICouponEbookCriteria;

export type ICouponCriteriaCreate =
  | ICouponAllCriteriaCreate
  | ICouponCategoryCriteriaCreate
  | ICouponTeacherCriteriaCreate
  | ICouponCourseCriteriaCreate
  | ICouponEbookCriteriaCreate;

export type ICouponCriteriaUpdate =
  | Omit<RequiredField<Partial<ICouponAllCriteria>, 'type' | 'id'>, 'couponId'>
  | Omit<
      RequiredField<Partial<ICouponCategoryCriteria>, 'type' | 'id'>,
      'couponId'
    >
  | Omit<
      RequiredField<Partial<ICouponTeacherCriteria>, 'type' | 'id'>,
      'couponId'
    >
  | Omit<
      RequiredField<Partial<ICouponCourseCriteria>, 'type' | 'id'>,
      'couponId'
    >
  | Omit<
      RequiredField<Partial<ICouponEbookCriteria>, 'type' | 'id'>,
      'couponId'
    >;

export type ICouponWithCriteria = ICoupon & {
  couponAllCriteria: ICouponAllCriteria[];
  couponCategoryCriteria: ICouponCategoryCriteria[];
  couponTeacherCriteria: ICouponTeacherCriteria[];
  couponCourseCriteria: ICouponCourseCriteria[];
  couponEbookCriteria: ICouponEbookCriteria[];
};
