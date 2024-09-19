import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { CouponTicketRepository } from '@src/v1/coupon/ticket/coupon-ticket.repository';
import {
  ICouponTicket,
  ICouponTicketCreateParams,
} from '@src/v1/coupon/ticket/coupon-ticket.interface';
import { CouponQueryService } from '@src/v1/coupon/coupon-query.service';
import { UserService } from '@src/v1/user/user.service';
import * as date from '@src/shared/utils/date';
import { CouponDisposableQueryService } from '@src/v1/coupon/disposable/coupon-disposable-query.service';
import { ICoupon } from '@src/v1/coupon/coupon.interface';
import { CouponTicketQueryService } from '@src/v1/coupon/ticket/coupon-ticket-query.service';
import { ICouponDisposable } from '@src/v1/coupon/disposable/coupon-disposable.interface';

@Injectable()
export class CouponTicketService {
  private readonly logger = new Logger(CouponTicketService.name);
  constructor(
    private readonly userService: UserService,
    private readonly couponQueryService: CouponQueryService,
    private readonly couponTicketQueryService: CouponTicketQueryService,
    private readonly couponDisposableQueryService: CouponDisposableQueryService,
    private readonly couponTicketRepository: CouponTicketRepository,
  ) {}

  async createCouponTicket(
    params: ICouponTicketCreateParams,
  ): Promise<ICouponTicket> {
    const user = await this.userService.findUserByIdOrThrow({
      id: params.userId,
    });

    const coupon = await this.couponQueryService.findCouponOrThrow({
      id: params.couponId,
    });

    // Check if the coupon got maximum count.
    if (coupon.volume) {
      const issuedCouponTicketCount =
        await this.couponTicketQueryService.getIssuedCouponTicketCount({
          couponId: coupon.id,
        });

      if (issuedCouponTicketCount >= coupon.volume) {
        throw new ConflictException('Coupon volume limit exceeded');
      }
    }

    // Check if the user has already used the coupon.
    if (coupon.volumePerCitizen) {
      const userIssuedCouponTicketCount =
        await this.couponTicketQueryService.getUserIssuedCouponTicketCount({
          couponId: coupon.id,
          userId: user.id,
        });

      if (userIssuedCouponTicketCount >= coupon.volumePerCitizen) {
        throw new ConflictException('Coupon volume per citizen limit exceeded');
      }
    }

    const couponTicket =
      params.type === 'public'
        ? await this._createPublicCouponTicket(coupon, params)
        : await this._createDisposableCouponTicket(coupon, params);

    this.logger.log('[CreateCouponTicket]', couponTicket);

    return couponTicket;
  }

  // Calculate coupon ticket expired date.
  // Compare expiredAt with expiredIn and return the fastest one.
  // If expiredAt and expiredIn are both null, return null.
  private _calculateCouponExpiredAt(
    now: Date,
    { expiredAt, expiredIn }: Pick<ICoupon, 'expiredAt' | 'expiredIn'>,
  ): Date | null {
    if (!expiredAt && !expiredIn) {
      return null;
    }

    if (expiredAt && !expiredIn) {
      return expiredAt;
    }

    if (!expiredAt && expiredIn) {
      return date.addDate(now, expiredIn, 'day', 'date');
    }

    if (expiredAt && expiredIn) {
      const calculatedExpiredIn = date.addDate(now, expiredIn, 'day', 'date');
      return expiredAt < calculatedExpiredIn ? expiredAt : calculatedExpiredIn;
    }

    throw new Error('[Assert] Invalid expiredAt or expiredIn');
  }

  private async _createPublicCouponTicket(
    coupon: ICoupon,
    params: ICouponTicketCreateParams,
  ): Promise<ICouponTicket> {
    const now = date.now('date');

    const expiredAt = this._calculateCouponExpiredAt(now, coupon);

    const couponTicket = await this.couponTicketRepository.createCouponTicket({
      couponId: params.couponId,
      userId: params.userId,
      couponDisposableId: null,
      createdAt: now,
      expiredAt,
    });

    return couponTicket;
  }

  private async _createDisposableCouponTicket(
    coupon: ICoupon,
    params: ICouponTicketCreateParams & Pick<ICouponDisposable, 'code'>,
  ): Promise<ICouponTicket> {
    const couponDisposable =
      await this.couponDisposableQueryService.findCouponDisposableByCodeOrThrow(
        { code: params.code },
      );

    const now = date.now('date');

    const expiredAt = this._calculateCouponExpiredAt(now, coupon);

    const couponTicket = await this.couponTicketRepository.createCouponTicket({
      couponId: params.couponId,
      userId: params.userId,
      couponDisposableId: couponDisposable?.id ?? null,
      createdAt: now,
      expiredAt,
    });

    return couponTicket;
  }
}
