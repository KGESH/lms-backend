import { Injectable } from '@nestjs/common';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import {
  ICouponTicket,
  ICouponTicketCreate,
} from '@src/v1/coupon/ticket/coupon-ticket.interface';
import { dbSchema } from '@src/infra/db/schema';

@Injectable()
export class CouponTicketRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async createCouponTicket(
    params: ICouponTicketCreate,
    db = this.drizzle.db,
  ): Promise<ICouponTicket> {
    const [couponTicket] = await db
      .insert(dbSchema.couponTickets)
      .values(params)
      .returning();

    return couponTicket;
  }
}
