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

export type CreateCouponAllCriteriaDto = Omit<CouponAllCriteriaDto, 'id'>;

export type UpdateCouponAllCriteriaDto = Omit<
  RequiredField<Partial<CouponAllCriteriaDto>, 'type' | 'id'>,
  'couponId'
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
  'id'
>;

export type UpdateCouponCategoryCriteriaDto = Omit<
  RequiredField<Partial<CouponCategoryCriteriaDto>, 'type' | 'id'>,
  'couponId'
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
  'id'
>;

export type UpdateCouponTeacherCriteriaDto = Omit<
  RequiredField<Partial<CouponTeacherCriteriaDto>, 'type' | 'id'>,
  'couponId'
>;

export type CouponCourseCriteriaDto = CouponCriteriaBaseDto & {
  /**
   * 쿠폰 적용 조건 타입
   */
  type: 'course';
  courseId: Uuid;
};

export type CreateCouponCourseCriteriaDto = Omit<CouponCourseCriteriaDto, 'id'>;

export type UpdateCouponCourseCriteriaDto = Omit<
  RequiredField<Partial<CouponCourseCriteriaDto>, 'type' | 'id'>,
  'couponId'
>;

export type CouponEbookCriteriaDto = CouponCriteriaBaseDto & {
  /**
   * 쿠폰 적용 조건 타입
   */
  type: 'ebook';
  ebookId: Uuid;
};

export type CreateCouponEbookCriteriaDto = Omit<CouponEbookCriteriaDto, 'id'>;

export type UpdateCouponEbookCriteriaDto = Omit<
  RequiredField<Partial<CouponEbookCriteriaDto>, 'type' | 'id'>,
  'couponId'
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

export type CouponCriteriaUpdateDto =
  | UpdateCouponAllCriteriaDto
  | UpdateCouponCategoryCriteriaDto
  | UpdateCouponTeacherCriteriaDto
  | UpdateCouponCourseCriteriaDto
  | UpdateCouponEbookCriteriaDto;
