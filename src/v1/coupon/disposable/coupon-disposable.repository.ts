import { Injectable } from '@nestjs/common';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import {
  ICouponDisposable,
  ICouponDisposableCreate,
} from '@src/v1/coupon/disposable/coupon-disposable.interface';
import { dbSchema } from '@src/infra/db/schema';

@Injectable()
export class CouponDisposableRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async createCouponDisposable(
    params: ICouponDisposableCreate | ICouponDisposableCreate[],
    db = this.drizzle.db,
  ): Promise<ICouponDisposable[]> {
    const createManyParams = Array.isArray(params) ? params : [params];

    const couponDisposables = await db
      .insert(dbSchema.couponDisposables)
      .values(createManyParams)
      .returning();

    return couponDisposables;
  }
}
