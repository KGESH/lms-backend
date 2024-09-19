import { ConflictException, Injectable } from '@nestjs/common';
import {
  ICouponDisposable,
  ICouponDisposableCreate,
} from '@src/v1/coupon/disposable/coupon-disposable.interface';
import { CouponDisposableQueryRepository } from '@src/v1/coupon/disposable/coupon-disposable-query.repository';
import { CouponDisposableRepository } from '@src/v1/coupon/disposable/coupon-disposable.repository';
import { UInt, Uuid } from '@src/shared/types/primitive';
import * as typia from 'typia';

@Injectable()
export class CouponDisposableService {
  constructor(
    private readonly couponDisposableRepository: CouponDisposableRepository,
    private readonly couponDisposableQueryRepository: CouponDisposableQueryRepository,
  ) {}

  async createCouponDisposables(
    params: Pick<ICouponDisposableCreate, 'couponId' | 'expiredAt'>,
    count: UInt,
  ): Promise<ICouponDisposable[]> {
    // Todo: Generate random codes.
    const codes: string[] = Array.from({ length: count }, () =>
      typia.random<Uuid>(),
    );

    const alreadyExists =
      await this.couponDisposableQueryRepository.findCouponDisposablesByCodes(
        codes,
      );

    if (alreadyExists.length > 0) {
      throw new ConflictException('Random gen coupon code conflict. try again');
    }

    const createCouponDisposableParams = codes.map((code) => ({
      ...params,
      code,
    }));

    return await this.couponDisposableRepository.createCouponDisposable(
      createCouponDisposableParams,
    );
  }
}
