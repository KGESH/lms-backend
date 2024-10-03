import { Injectable, NotFoundException } from '@nestjs/common';
import {
  ICouponTicket,
  ICouponTicketPagination,
  ICouponTicketPaymentRelations,
  ICouponTicketQuery,
  ICouponTicketRelations,
} from '@src/v1/coupon/ticket/coupon-ticket.interface';
import { CouponTicketQueryRepository } from '@src/v1/coupon/ticket/coupon-ticket-query.repository';
import { UInt } from '@src/shared/types/primitive';
import { UserService } from '@src/v1/user/user.service';
import { Paginated } from '@src/shared/types/pagination';
import { IUserWithoutPassword } from '@src/v1/user/user.interface';

@Injectable()
export class CouponTicketQueryService {
  constructor(
    private readonly userService: UserService,
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

  async _findCouponTicketsOwner(
    query: ICouponTicketQuery,
  ): Promise<Paginated<IUserWithoutPassword[]> | null> {
    switch (query.search?.type) {
      case 'displayName':
        return await this.userService.findUsers(
          {
            displayName: query.search.value,
          },
          {
            page: 1,
            pageSize: 10000,
            orderBy: 'desc',
          },
        );

      case 'email':
        return await this.userService.findUsers(
          {
            email: query.search.value,
          },
          {
            page: 1,
            pageSize: 10000,
            orderBy: 'desc',
          },
        );

      case 'name':
        return await this.userService.findUsers(
          {
            name: query.search.value,
          },
          {
            page: 1,
            pageSize: 10000,
            orderBy: 'desc',
          },
        );

      case 'phoneNumber':
        return await this.userService.findUsers(
          {
            phoneNumber: query.search.value,
          },
          {
            page: 1,
            pageSize: 10000,
            orderBy: 'desc',
          },
        );

      default:
        return null;
    }
  }

  async findManyCouponTicketsRelations(
    query: ICouponTicketQuery,
    pagination: ICouponTicketPagination,
  ): Promise<Paginated<ICouponTicketPaymentRelations[]>> {
    const foundUsers = await this._findCouponTicketsOwner(query);

    if (query.search && !foundUsers) {
      return {
        pagination,
        totalCount: 0,
        data: [],
      };
    }

    return await this.couponTicketQueryRepository.findManyCouponTicketsRelations(
      {
        couponId: query.couponId,
        userIds: foundUsers?.data.map((user) => user.id) ?? undefined,
      },
      pagination,
    );
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

  async findCouponTicketPaymentRelations(
    where: Pick<ICouponTicket, 'id'>,
  ): Promise<ICouponTicketPaymentRelations | null> {
    return await this.couponTicketQueryRepository.findCouponTicketPaymentRelations(
      where,
    );
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
