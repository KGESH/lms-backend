import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ICouponDisposable } from '@src/v1/coupon/disposable/coupon-disposable.interface';
import { CouponDisposableQueryRepository } from '@src/v1/coupon/disposable/coupon-disposable-query.repository';
import { OptionalPick } from '@src/shared/types/optional';
import { Pagination } from '@src/shared/types/pagination';

@Injectable()
export class CouponDisposableQueryService {
  constructor(
    private readonly couponDisposableQueryRepository: CouponDisposableQueryRepository,
  ) {}

  async findCouponDisposables(
    where: OptionalPick<ICouponDisposable, 'couponId' | 'code'>,
    pagination: Pagination,
  ): Promise<ICouponDisposable[]> {
    if (!where.couponId && !where.code) {
      throw new BadRequestException('couponId or code is required');
    }

    return await this.couponDisposableQueryRepository.findCouponDisposables(
      where,
      pagination,
    );
  }

  async findCouponDisposable(
    where: Pick<ICouponDisposable, 'id'>,
  ): Promise<ICouponDisposable | null> {
    return await this.couponDisposableQueryRepository.findCouponDisposable(
      where,
    );
  }

  async findCouponDisposableOrThrow(
    where: Pick<ICouponDisposable, 'id'>,
  ): Promise<ICouponDisposable> {
    const couponDisposable = await this.findCouponDisposable(where);

    if (!couponDisposable) {
      throw new NotFoundException('CouponDisposable not found');
    }

    return couponDisposable;
  }

  async findCouponDisposableByCode(
    where: Pick<ICouponDisposable, 'code'>,
  ): Promise<ICouponDisposable | null> {
    return await this.couponDisposableQueryRepository.findCouponDisposableByCode(
      where,
    );
  }

  async findCouponDisposableByCodeOrThrow(
    where: Pick<ICouponDisposable, 'code'>,
  ): Promise<ICouponDisposable> {
    const couponDisposable =
      await this.couponDisposableQueryRepository.findCouponDisposableByCode(
        where,
      );

    if (!couponDisposable) {
      throw new NotFoundException('Invalid coupon code');
    }

    return couponDisposable;
  }
}
