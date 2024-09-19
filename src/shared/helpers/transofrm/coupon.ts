import * as date from '@src/shared/utils/date';
import { ICoupon } from '@src/v1/coupon/coupon.interface';
import { CouponDto } from '@src/v1/coupon/coupon.dto';
import {
  ICouponTicket,
  ICouponTicketPaymentRelations,
  ICouponTicketRelations,
} from '@src/v1/coupon/ticket/coupon-ticket.interface';
import {
  CouponTicketDto,
  CouponTicketRelationsDto,
  CouponTicketWithPaymentHistoryDto,
} from '@src/v1/coupon/ticket/coupon-ticket.dto';
import { ICouponDisposable } from '@src/v1/coupon/disposable/coupon-disposable.interface';
import { CouponDisposableDto } from '@src/v1/coupon/disposable/coupon-disposable.dto';
import { ICouponTicketPayment } from '@src/v1/coupon/ticket/payment/coupon-ticket-payment.interface';
import { CouponTicketPaymentDto } from '@src/v1/coupon/ticket/payment/coupon-ticket-payment.dto';

export const couponToDto = (coupon: ICoupon): CouponDto => {
  return {
    ...coupon,
    openedAt: coupon.openedAt ? date.toISOString(coupon.openedAt) : null,
    closedAt: coupon.closedAt ? date.toISOString(coupon.closedAt) : null,
    expiredAt: coupon.expiredAt ? date.toISOString(coupon.expiredAt) : null,
  };
};

export const couponTicketToDto = (
  couponTicket: ICouponTicket,
): CouponTicketDto => {
  return {
    ...couponTicket,
    createdAt: date.toISOString(couponTicket.createdAt),
    expiredAt: couponTicket.expiredAt
      ? date.toISOString(couponTicket.expiredAt)
      : null,
  };
};

export const couponDisposableToDto = (
  couponDisposable: ICouponDisposable,
): CouponDisposableDto => {
  return {
    ...couponDisposable,
    createdAt: date.toISOString(couponDisposable.createdAt),
    expiredAt: couponDisposable.expiredAt
      ? date.toISOString(couponDisposable.expiredAt)
      : null,
  };
};

export const couponTicketPaymentToDto = (
  couponTicketPayment: ICouponTicketPayment,
): CouponTicketPaymentDto => {
  return {
    ...couponTicketPayment,
    createdAt: date.toISOString(couponTicketPayment.createdAt),
    deletedAt: couponTicketPayment.deletedAt
      ? date.toISOString(couponTicketPayment.deletedAt)
      : null,
  };
};

export const couponTicketPaymentHistoryToDto = (
  couponTicketPaymentRelations: ICouponTicketPaymentRelations,
): CouponTicketWithPaymentHistoryDto => {
  return {
    ...couponTicketToDto(couponTicketPaymentRelations),
    payment: couponTicketPaymentRelations.payment
      ? couponTicketPaymentToDto(couponTicketPaymentRelations.payment)
      : null,
  };
};

export const couponTicketRelationsToDto = (
  couponRelations: ICouponTicketRelations,
): CouponTicketRelationsDto => {
  return {
    ...couponToDto(couponRelations),
    ticket: couponTicketToDto(couponRelations.ticket),
    couponAllCriteria: couponRelations.couponAllCriteria,
    couponCategoryCriteria: couponRelations.couponCategoryCriteria,
    couponTeacherCriteria: couponRelations.couponTeacherCriteria,
    couponCourseCriteria: couponRelations.couponCourseCriteria,
    couponEbookCriteria: couponRelations.couponEbookCriteria,
  };
};
