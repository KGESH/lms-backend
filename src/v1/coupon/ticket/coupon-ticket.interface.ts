import { Uuid } from '@src/shared/types/primitive';
import { Optional } from '@src/shared/types/optional';
import { ICoupon } from '@src/v1/coupon/coupon.interface';
import {
  ICouponAllCriteria,
  ICouponCategoryCriteria,
  ICouponCourseCriteria,
  ICouponEbookCriteria,
  ICouponTeacherCriteria,
} from '@src/v1/coupon/criteria/coupon-criteria.interface';
import { ICouponTicketPayment } from '@src/v1/coupon/ticket/payment/coupon-ticket-payment.interface';

/**
 * 발급된 쿠폰
 */
export type ICouponTicket = {
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
  createdAt: Date;

  /**
   * 만료 일자
   */
  expiredAt: Date | null;
};

export type ICouponTicketCreate = Optional<ICouponTicket, 'id' | 'createdAt'>;

export type IPublicCouponTicketCreate = {
  type: 'public';
  couponId: Uuid;
  userId: Uuid;
};

export type IPrivateCouponTicketCreate = {
  type: 'private';
  code: string;
  couponId: Uuid;
  userId: Uuid;
};

export type ICouponTicketCreateParams =
  | IPublicCouponTicketCreate
  | IPrivateCouponTicketCreate;

export type ICouponTicketRelations = ICoupon & {
  ticket: ICouponTicket;
  couponAllCriteria: ICouponAllCriteria[];
  couponCategoryCriteria: ICouponCategoryCriteria[];
  couponTeacherCriteria: ICouponTeacherCriteria[];
  couponCourseCriteria: ICouponCourseCriteria[];
  couponEbookCriteria: ICouponEbookCriteria[];
};

export type ICouponTicketPaymentRelations = ICouponTicket & {
  payment: ICouponTicketPayment | null;
};
