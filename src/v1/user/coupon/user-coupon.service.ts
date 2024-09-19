import { Injectable } from '@nestjs/common';
import { CouponTicketQueryService } from '@src/v1/coupon/ticket/coupon-ticket-query.service';
import {
  ICouponTicket,
  ICouponTicketPaymentRelations,
  ICouponTicketCreateParams,
} from '@src/v1/coupon/ticket/coupon-ticket.interface';
import { CouponTicketService } from '@src/v1/coupon/ticket/coupon-ticket.service';

@Injectable()
export class UserCouponService {
  constructor(
    private readonly couponTicketService: CouponTicketService,
    private readonly couponTicketQueryService: CouponTicketQueryService,
  ) {}

  async issueCouponTicket(
    params: ICouponTicketCreateParams,
  ): Promise<ICouponTicket> {
    return await this.couponTicketService.createCouponTicket(params);
  }

  async getUserCoupons(
    where: Pick<ICouponTicket, 'userId'>,
  ): Promise<ICouponTicketPaymentRelations[]> {
    return await this.couponTicketQueryService.findCouponTicketsByUserId(where);
  }
}
