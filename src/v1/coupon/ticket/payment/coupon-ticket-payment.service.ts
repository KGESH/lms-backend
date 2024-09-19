import { Injectable } from '@nestjs/common';
import {
  ICouponTicketPayment,
  ICouponTicketPaymentCreate,
} from '@src/v1/coupon/ticket/payment/coupon-ticket-payment.interface';
import { CouponTicketPaymentRepository } from '@src/v1/coupon/ticket/payment/coupon-ticket-payment.repository';
import { TransactionClient } from '@src/infra/db/drizzle.types';

@Injectable()
export class CouponTicketPaymentService {
  constructor(
    private readonly couponTicketPaymentRepository: CouponTicketPaymentRepository,
  ) {}

  async createCouponTicketPayments(
    params: ICouponTicketPaymentCreate,
    tx: TransactionClient,
  ): Promise<ICouponTicketPayment> {
    const couponTicketPayments =
      await this.couponTicketPaymentRepository.createCouponTicketPayment(
        params,
        tx,
      );

    return couponTicketPayments;
  }
}
