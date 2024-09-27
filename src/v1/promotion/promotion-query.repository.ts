import { Injectable } from '@nestjs/common';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import {
  IPromotion,
  IPromotionPagination,
} from '@src/v1/promotion/promotion.interface';
import { eq, count } from 'drizzle-orm';
import { dbSchema } from '@src/infra/db/schema';
import { IPromotionRelations } from '@src/v1/promotion/promotion-relations.interface';
import { Paginated } from '@src/shared/types/pagination';
import { assertCoupon } from '@src/shared/helpers/assert/coupon';

@Injectable()
export class PromotionQueryRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async findManyPromotionsRelations(
    pagination: IPromotionPagination,
  ): Promise<Paginated<IPromotionRelations[]>> {
    const { totalCount, promotionsRelations } =
      await this.drizzle.db.transaction(async (tx) => {
        const totalPromotionCountQuery = tx
          .select({ totalCount: count() })
          .from(dbSchema.promotions);

        const promotionQuery = tx.query.promotions.findMany({
          with: {
            coupon: true,
            contents: true,
          },
          orderBy: (promotion, { asc, desc }) =>
            pagination.orderBy === 'asc'
              ? asc(promotion[pagination.orderByColumn])
              : desc(promotion[pagination.orderByColumn]),
          offset: (pagination.page - 1) * pagination.pageSize,
          limit: pagination.pageSize,
        });

        const [[{ totalCount }], promotionsRelations] = await Promise.all([
          totalPromotionCountQuery,
          promotionQuery,
        ]);

        return { totalCount, promotionsRelations };
      });

    return {
      totalCount: totalCount ?? 0,
      pagination,
      data: promotionsRelations.map((promotionRelations) => ({
        ...promotionRelations,
        coupon: promotionRelations.coupon
          ? assertCoupon(promotionRelations.coupon)
          : null,
      })),
    };
  }

  async findPromotionRelations(
    where: Pick<IPromotion, 'id'>,
  ): Promise<IPromotionRelations | null> {
    const promotionRelations = await this.drizzle.db.query.promotions.findFirst(
      {
        where: eq(dbSchema.promotions.id, where.id),
        with: {
          coupon: true,
          contents: true,
        },
      },
    );

    if (!promotionRelations) {
      return null;
    }

    return {
      ...promotionRelations,
      coupon: promotionRelations.coupon
        ? assertCoupon(promotionRelations.coupon)
        : null,
    };
  }
}
