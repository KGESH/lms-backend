import { ISO8601, Uuid } from '@src/shared/types/primitive';
import { CouponTicketPaymentDto } from '@src/v1/coupon/ticket/payment/coupon-ticket-payment.dto';
import { CouponDto } from '@src/v1/coupon/coupon.dto';
import {
  CouponAllCriteriaDto,
  CouponCategoryCriteriaDto,
  CouponCourseCriteriaDto,
  CouponEbookCriteriaDto,
  CouponTeacherCriteriaDto,
} from '@src/v1/coupon/criteria/coupon-criteria.dto';
import { Pagination } from '@src/shared/types/pagination';
import { UserWithoutPasswordDto } from '@src/v1/user/user.dto';

/**
 * 발급된 쿠폰
 */
export type CouponTicketDto = {
  /**
   * 발급된 쿠폰 ID
   */
  id: Uuid;

  /**
   * 쿠폰 ID
   */
  couponId: Uuid;

  /**
   * 사용자 ID
   */
  userId: Uuid;

  /**
   * 일회용 쿠폰 코드 ID
   */
  couponDisposableId: Uuid | null;

  /**
   * 발급 일자
   */
  createdAt: ISO8601;

  /**
   * 만료 일자
   */
  expiredAt: ISO8601 | null;
};

export type CreatePublicCouponTicketDto = {
  type: 'public';
  couponId: Uuid;
  userId: Uuid;
};

export type CreatePrivateCouponTicketDto = {
  type: 'private';
  code: string;
  couponId: Uuid;
  userId: Uuid;
};

export type CouponTicketRelationsDto = CouponDto & {
  ticket: CouponTicketDto;
  couponAllCriteria: CouponAllCriteriaDto[];
  couponCategoryCriteria: CouponCategoryCriteriaDto[];
  couponTeacherCriteria: CouponTeacherCriteriaDto[];
  couponCourseCriteria: CouponCourseCriteriaDto[];
  couponEbookCriteria: CouponEbookCriteriaDto[];
};

export type CouponTicketPaymentRelationsDto = CouponTicketRelationsDto & {
  user: UserWithoutPasswordDto;
  payment: CouponTicketPaymentDto | null;
};

export type CouponTicketPaginationDto = Pagination & {
  orderByColumn: keyof Pick<CouponTicketDto, 'createdAt' | 'expiredAt'>;
};

/**
 * 사용자 필터링
 */
export type CouponTicketSearchDto = {
  userFilterType: 'email' | 'displayName' | 'name' | 'phoneNumber';
  userFilterValue: string;
};

export type CouponTicketQuery = Partial<
  CouponTicketPaginationDto & CouponTicketSearchDto
>;
