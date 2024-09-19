import { Injectable } from '@nestjs/common';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import { ICouponDisposable } from '@src/v1/coupon/disposable/coupon-disposable.interface';
import { and, eq, inArray } from 'drizzle-orm';
import { dbSchema } from '@src/infra/db/schema';
import { OptionalPick } from '@src/shared/types/optional';
import { Pagination } from '@src/shared/types/pagination';

@Injectable()
export class CouponDisposableQueryRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async findCouponDisposablesByCodes(
    codes: ICouponDisposable['code'][],
  ): Promise<ICouponDisposable[]> {
    const couponDisposables =
      await this.drizzle.db.query.couponDisposables.findMany({
        where: inArray(dbSchema.couponDisposables.code, codes),
      });

    return couponDisposables;
  }

  async findCouponDisposables(
    where: OptionalPick<ICouponDisposable, 'couponId' | 'code'>,
    pagination: Pagination,
  ): Promise<ICouponDisposable[]> {
    const couponDisposables =
      await this.drizzle.db.query.couponDisposables.findMany({
        where: and(
          where.couponId
            ? eq(dbSchema.couponDisposables.couponId, where.couponId)
            : undefined,
          where.code
            ? eq(dbSchema.couponDisposables.code, where.code)
            : undefined,
        ),
        orderBy: (couponDisposable, { asc, desc }) =>
          pagination.orderBy === 'asc'
            ? asc(couponDisposable.createdAt)
            : desc(couponDisposable.createdAt),
        offset: (pagination.page - 1) * pagination.pageSize,
        limit: pagination.pageSize,
      });

    return couponDisposables;
  }

  async findCouponDisposable(
    where: Pick<ICouponDisposable, 'id'>,
  ): Promise<ICouponDisposable | null> {
    const couponDisposable =
      await this.drizzle.db.query.couponDisposables.findFirst({
        where: eq(dbSchema.couponDisposables.id, where.id),
      });

    return couponDisposable ?? null;
  }

  async findCouponDisposableByCode(
    where: Pick<ICouponDisposable, 'code'>,
  ): Promise<ICouponDisposable | null> {
    const couponDisposable =
      await this.drizzle.db.query.couponDisposables.findFirst({
        where: eq(dbSchema.couponDisposables.code, where.code),
      });

    return couponDisposable ?? null;
  }
}
