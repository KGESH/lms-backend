import { Injectable } from '@nestjs/common';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import {
  ICouponTicketPayment,
  ICouponTicketPaymentCreate,
} from '@src/v1/coupon/ticket/payment/coupon-ticket-payment.interface';
import { dbSchema } from '@src/infra/db/schema';

@Injectable()
export class CouponTicketPaymentRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async createCouponTicketPayment(
    params: ICouponTicketPaymentCreate,
    db = this.drizzle.db,
  ): Promise<ICouponTicketPayment> {
    const [couponTicketPayments] = await db
      .insert(dbSchema.couponTicketPayments)
      .values(params)
      .returning();

    return couponTicketPayments;
  }
}
