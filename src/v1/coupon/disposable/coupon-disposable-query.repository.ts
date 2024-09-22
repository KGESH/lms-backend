import { Injectable } from '@nestjs/common';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import {
  ICouponDisposable,
  ICouponDisposableWithUsedTicket,
} from '@src/v1/coupon/disposable/coupon-disposable.interface';
import { and, asc, desc, eq, inArray, sql } from 'drizzle-orm';
import { dbSchema } from '@src/infra/db/schema';
import { OptionalPick } from '@src/shared/types/optional';
import { Paginated, Pagination } from '@src/shared/types/pagination';

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
  ): Promise<Paginated<ICouponDisposable[]>> {
    const couponDisposables = await this.drizzle.db
      .select({
        couponDisposable: dbSchema.couponDisposables,
        totalCount: sql<number>`count(*) over()`.mapWith(Number),
      })
      .from(dbSchema.couponDisposables)
      .where(
        and(
          where.couponId
            ? eq(dbSchema.couponDisposables.couponId, where.couponId)
            : undefined,
          where.code
            ? eq(dbSchema.couponDisposables.code, where.code)
            : undefined,
        ),
      )
      .orderBy(
        pagination.orderBy === 'asc'
          ? asc(dbSchema.couponDisposables.createdAt)
          : desc(dbSchema.couponDisposables.createdAt),
      )
      .offset((pagination.page - 1) * pagination.pageSize)
      .limit(pagination.pageSize);

    return {
      pagination,
      totalCount: couponDisposables[0]?.totalCount ?? 0,
      data: couponDisposables.map(({ couponDisposable }) => couponDisposable),
    };
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
  ): Promise<ICouponDisposableWithUsedTicket | null> {
    const couponDisposable =
      await this.drizzle.db.query.couponDisposables.findFirst({
        where: eq(dbSchema.couponDisposables.code, where.code),
        with: {
          ticket: true,
        },
      });

    if (!couponDisposable) {
      return null;
    }

    return { ...couponDisposable, usedTicket: couponDisposable.ticket ?? null };
  }
}
