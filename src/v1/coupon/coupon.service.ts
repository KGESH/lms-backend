import { Injectable, Logger } from '@nestjs/common';
import { CouponRepository } from '@src/v1/coupon/coupon.repository';
import {
  ICoupon,
  ICouponCreate,
  ICouponUpdate,
} from '@src/v1/coupon/coupon.interface';
import { Uuid } from '@src/shared/types/primitive';
import {
  ICouponAllCriteria,
  ICouponCategoryCriteria,
  ICouponCourseCriteria,
  ICouponCriteria,
  ICouponCriteriaCreate,
  ICouponCriteriaUpdate,
  ICouponEbookCriteria,
  ICouponTeacherCriteria,
  ICouponWithCriteria,
} from '@src/v1/coupon/criteria/coupon-criteria.interface';
import { CouponCriteriaRepository } from '@src/v1/coupon/criteria/coupon-criteria.repository';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import * as typia from 'typia';
import { CouponQueryService } from '@src/v1/coupon/coupon-query.service';

@Injectable()
export class CouponService {
  private readonly logger = new Logger(CouponService.name);
  constructor(
    private readonly couponQueryService: CouponQueryService,
    private readonly couponRepository: CouponRepository,
    private readonly couponCriteriaRepository: CouponCriteriaRepository,
    private readonly drizzle: DrizzleService,
  ) {}

  async createCoupon(
    couponCreateParams: ICouponCreate,
    criteriaCreateParams: Omit<ICouponCriteriaCreate, 'couponId'>[],
  ): Promise<ICouponWithCriteria> {
    const criteriaMap = new Map<ICouponCriteria['type'], ICouponCriteria[]>();

    const { coupon } = await this.drizzle.db.transaction(async (tx) => {
      const coupon = await this.couponRepository.createCoupon(
        couponCreateParams,
        tx,
      );

      if (criteriaCreateParams.length > 0) {
        const criteria = await Promise.all(
          criteriaCreateParams.map((params) =>
            this.couponCriteriaRepository.createCouponCriteria(
              typia.assert<ICouponCriteriaCreate>({
                ...params,
                couponId: coupon.id,
              }),
              tx,
            ),
          ),
        );

        criteria.forEach((c) => {
          const criteriaList = criteriaMap.get(c.type) ?? [];
          criteriaList.push(c);
          criteriaMap.set(c.type, criteriaList);
        });
      }

      return { coupon };
    });

    return {
      ...coupon,
      couponAllCriteria: typia.assert<ICouponAllCriteria[]>(
        criteriaMap.get('all') ?? [],
      ),
      couponCategoryCriteria: typia.assert<ICouponCategoryCriteria[]>(
        criteriaMap.get('category') ?? [],
      ),
      couponTeacherCriteria: typia.assert<ICouponTeacherCriteria[]>(
        criteriaMap.get('teacher') ?? [],
      ),
      couponCourseCriteria: typia.assert<ICouponCourseCriteria[]>(
        criteriaMap.get('course') ?? [],
      ),
      couponEbookCriteria: typia.assert<ICouponEbookCriteria[]>(
        criteriaMap.get('ebook') ?? [],
      ),
    };
  }

  async updateCoupon(
    where: Pick<ICoupon, 'id'>,
    couponUpdateParams: ICouponUpdate,
    criteriaUpdateParams: {
      create: Omit<ICouponCriteriaCreate, 'couponId'>[];
      update: Omit<ICouponCriteriaUpdate, 'couponId'>[];
    },
  ): Promise<ICouponWithCriteria> {
    {
      const existCoupon =
        await this.couponQueryService.findCouponOrThrow(where);

      const validCouponUpdateParams =
        typia.misc.clone<ICouponUpdate>(couponUpdateParams);

      const needCouponUpdate = Object.values(validCouponUpdateParams).some(
        (v) => v !== undefined,
      );

      const criteriaMap = new Map<ICouponCriteria['type'], ICouponCriteria[]>();

      await this.drizzle.db.transaction(async (tx) => {
        const updatedCoupon = needCouponUpdate
          ? await this.couponRepository.updateCoupon(
              where,
              validCouponUpdateParams,
            )
          : existCoupon;

        if (criteriaUpdateParams.create.length > 0) {
          const createdCriteria = await Promise.all(
            criteriaUpdateParams.create.map((params) =>
              this.couponCriteriaRepository.createCouponCriteria(
                typia.assert<ICouponCriteriaCreate>({
                  ...params,
                  couponId: existCoupon.id,
                }),
                tx,
              ),
            ),
          );

          createdCriteria.forEach((c) => {
            const criteriaList = criteriaMap.get(c.type) ?? [];
            criteriaList.push(c);
            criteriaMap.set(c.type, criteriaList);
          });
        }

        if (criteriaUpdateParams.update.length > 0) {
          const updatedCriteria = await Promise.all(
            criteriaUpdateParams.update.map((params) =>
              this.couponCriteriaRepository.updateCouponCriteria(
                { id: params.id },
                params,
                tx,
              ),
            ),
          );

          updatedCriteria.forEach((c) => {
            const criteriaList = criteriaMap.get(c.type) ?? [];
            criteriaList.push(c);
            criteriaMap.set(c.type, criteriaList);
          });
        }

        return updatedCoupon;
      });

      const updatedCouponWithCriteria =
        await this.couponQueryService.findCouponWithCriteriaOrThrow(where);

      return updatedCouponWithCriteria;
    }
  }

  async deleteCoupon(where: Pick<ICoupon, 'id'>): Promise<Uuid> {
    const deletedCouponId = await this.couponRepository.deleteCoupon(where);

    this.logger.log('[DeleteCoupon ID]', deletedCouponId);

    return deletedCouponId;
  }
}
