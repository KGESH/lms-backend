import { Injectable } from '@nestjs/common';
import { PromotionService } from '@src/v1/promotion/promotion.service';
import { PromotionContentService } from '@src/v1/promotion/content/promotion-content.service';
import {
  IPromotion,
  IPromotionCreate,
  IPromotionUpdate,
} from '@src/v1/promotion/promotion.interface';
import {
  IPromotionContentCreate,
  IPromotionContentUpdate,
} from '@src/v1/promotion/content/promotion-content.interface';
import { IPromotionRelations } from '@src/v1/promotion/promotion-relations.interface';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import { CouponQueryService } from '@src/v1/coupon/coupon-query.service';
import { PromotionQueryService } from '@src/v1/promotion/promotion-query.service';

@Injectable()
export class PromotionDashboardService {
  constructor(
    private readonly promotionService: PromotionService,
    private readonly promotionContentService: PromotionContentService,
    private readonly promotionQueryService: PromotionQueryService,
    private readonly couponQueryService: CouponQueryService,
    private readonly drizzle: DrizzleService,
  ) {}

  async createPromotionPage({
    promotionCreateParams,
    promotionContentCreateParams,
  }: {
    promotionCreateParams: IPromotionCreate;
    promotionContentCreateParams: Omit<
      IPromotionContentCreate,
      'promotionId'
    >[];
  }): Promise<IPromotionRelations> {
    const coupon = promotionCreateParams.couponId
      ? await this.couponQueryService.findCouponOrThrow({
          id: promotionCreateParams.couponId,
        })
      : null;

    const { promotion, promotionContents } = await this.drizzle.db.transaction(
      async (tx) => {
        const promotion = await this.promotionService.createPromotion(
          promotionCreateParams,
          tx,
        );

        const promotionContents =
          await this.promotionContentService.createManyPromotionContents(
            promotionContentCreateParams.map((c) => ({
              ...c,
              promotionId: promotion.id,
            })),
            tx,
          );

        return { promotion, promotionContents };
      },
    );

    return {
      ...promotion,
      coupon,
      contents: promotionContents,
    };
  }

  async updatePromotionPage(
    where: Pick<IPromotion, 'id'>,
    {
      promotionUpdateParams,
      promotionContentUpdateParams,
    }: {
      promotionUpdateParams?: IPromotionUpdate;
      promotionContentUpdateParams?: IPromotionContentUpdate[];
    },
  ): Promise<IPromotionRelations> {
    const existPromotion =
      await this.promotionQueryService.findPromotionRelationsOrThrow({
        id: where.id,
      });

    // Validate coupon
    if (promotionUpdateParams?.couponId) {
      await this.couponQueryService.findCouponOrThrow({
        id: promotionUpdateParams.couponId,
      });
    }

    await this.drizzle.db.transaction(async (tx) => {
      // Update promotion
      if (promotionUpdateParams) {
        await this.promotionService.updatePromotion(
          {
            id: existPromotion.id,
          },
          promotionUpdateParams,
          tx,
        );
      }

      // Update promotion contents
      if (
        promotionContentUpdateParams &&
        promotionContentUpdateParams.length > 0
      ) {
        await Promise.all([
          promotionContentUpdateParams.map((p) =>
            this.promotionContentService.updatePromotionContent(
              { id: p.id },
              {
                ...p,
                promotionId: existPromotion.id,
              },
              tx,
            ),
          ),
        ]);
      }
    });

    const updated =
      await this.promotionQueryService.findPromotionRelationsOrThrow({
        id: existPromotion.id,
      });

    return updated;
  }
}
