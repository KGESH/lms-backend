import { Injectable, NotFoundException } from '@nestjs/common';
import {
  ICouponTicket, ICouponTicketPaymentRelations,
  ICouponTicketRelations
} from "@src/v1/coupon/ticket/coupon-ticket.interface";
import { CouponTicketQueryRepository } from '@src/v1/coupon/ticket/coupon-ticket-query.repository';
import { UInt } from '@src/shared/types/primitive';

@Injectable()
export class CouponTicketQueryService {
  constructor(
    private readonly couponTicketQueryRepository: CouponTicketQueryRepository,
  ) {}

  async findCouponTicket(
    where: Pick<ICouponTicket, 'id'>,
  ): Promise<ICouponTicket | null> {
    const couponTicket =
      await this.couponTicketQueryRepository.findCouponTicket(where);

    return couponTicket;
  }

  async findCouponTicketsByUserId(
    where: Pick<ICouponTicket, 'userId'>,
  ): Promise<ICouponTicketPaymentRelations[]> {
    const couponTickets =
      await this.couponTicketQueryRepository.findCouponTicketsByUserId(where);

    return couponTickets;
  }

  async findCouponTicketRelations(
    where: Pick<ICouponTicket, 'id'>,
  ): Promise<ICouponTicketRelations | null> {
    return await this.couponTicketQueryRepository.findCouponTicketRelations(
      where,
    );
  }

  async findCouponTicketRelationsOrThrow(
    where: Pick<ICouponTicket, 'id'>,
  ): Promise<ICouponTicketRelations> {
    const couponTicketRelations =
      await this.couponTicketQueryRepository.findCouponTicketRelations(where);

    if (!couponTicketRelations) {
      throw new NotFoundException('Coupon ticket not found');
    }

    return couponTicketRelations;
  }

  async getIssuedCouponTicketCount(
    where: Pick<ICouponTicket, 'couponId'>,
  ): Promise<UInt> {
    const couponTicketCount =
      await this.couponTicketQueryRepository.getIssuedCouponTicketCount(where);

    return couponTicketCount;
  }

  async getUserIssuedCouponTicketCount(
    where: Pick<ICouponTicket, 'couponId' | 'userId'>,
  ): Promise<UInt> {
    const userIssuedCouponTicketCount =
      await this.couponTicketQueryRepository.getIssuedCouponTicketCount(where);

    return userIssuedCouponTicketCount;
  }
}
