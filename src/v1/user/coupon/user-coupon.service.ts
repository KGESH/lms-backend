import { Injectable } from '@nestjs/common';
import { CouponTicketQueryService } from '@src/v1/coupon/ticket/coupon-ticket-query.service';
import {
  ICouponTicket,
  ICouponTicketPaymentRelations,
  ICouponTicketCreateParams,
  ICouponTicketRelations,
} from '@src/v1/coupon/ticket/coupon-ticket.interface';
import { CouponTicketService } from '@src/v1/coupon/ticket/coupon-ticket.service';
import { CouponDisposableQueryService } from '@src/v1/coupon/disposable/coupon-disposable-query.service';
import { ICouponDisposable } from '@src/v1/coupon/disposable/coupon-disposable.interface';

@Injectable()
export class UserCouponService {
  constructor(
    private readonly couponTicketService: CouponTicketService,
    private readonly couponTicketQueryService: CouponTicketQueryService,
    private readonly couponDisposableQueryService: CouponDisposableQueryService,
  ) {}

  async findCouponDisposableByCode(
    where: Pick<ICouponDisposable, 'code'>,
  ): Promise<ICouponDisposable | null> {
    return await this.couponDisposableQueryService.findCouponDisposableByCode(
      where,
    );
  }

  async issueCouponTicket(
    params: ICouponTicketCreateParams,
  ): Promise<ICouponTicketRelations> {
    return await this.couponTicketService.createCouponTicket(params);
  }

  async getUserCoupons(
    where: Pick<ICouponTicket, 'userId'>,
  ): Promise<ICouponTicketPaymentRelations[]> {
    return await this.couponTicketQueryService.findCouponTicketsByUserId(where);
  }
}
