import { Injectable } from '@nestjs/common';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import { dbSchema } from '@src/infra/db/schema';
import {
  ICouponAllCriteria,
  ICouponCategoryCriteria,
  ICouponCourseCriteria,
  ICouponCriteria,
  ICouponCriteriaCreate,
  ICouponEbookCriteria,
  ICouponTeacherCriteria,
  ICouponCriteriaUpdate,
} from '@src/v1/coupon/criteria/coupon-criteria.interface';
import * as typia from 'typia';
import { eq } from 'drizzle-orm';

@Injectable()
export class CouponCriteriaRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async createCouponCriteria(
    params: ICouponCriteriaCreate,
    db = this.drizzle.db,
  ): Promise<ICouponCriteria> {
    switch (params.type) {
      case 'all':
        const [couponAllCriteria] = await db
          .insert(dbSchema.couponAllCriteria)
          .values(params)
          .returning();
        return typia.assert<ICouponAllCriteria>(couponAllCriteria);

      case 'category':
        const [couponCategoryCriteria] = await db
          .insert(dbSchema.couponCategoryCriteria)
          .values(params)
          .returning();
        return typia.assert<ICouponCategoryCriteria>(couponCategoryCriteria);

      case 'teacher':
        const [couponTeacherCriteria] = await db
          .insert(dbSchema.couponTeacherCriteria)
          .values(params)
          .returning();
        return typia.assert<ICouponTeacherCriteria>(couponTeacherCriteria);

      case 'course':
        const [couponCourseCriteria] = await db
          .insert(dbSchema.couponCourseCriteria)
          .values(params)
          .returning();
        return typia.assert<ICouponCourseCriteria>(couponCourseCriteria);

      case 'ebook':
        const [couponEbookCriteria] = await db
          .insert(dbSchema.couponEbookCriteria)
          .values(params)
          .returning();
        return typia.assert<ICouponEbookCriteria>(couponEbookCriteria);
    }
  }

  async updateCouponCriteria(
    where: Pick<ICouponCriteria, 'id'>,
    params: ICouponCriteriaUpdate,
    db = this.drizzle.db,
  ): Promise<ICouponCriteria> {
    switch (params.type) {
      case 'all':
        const [couponAllCriteria] = await db
          .update(dbSchema.couponAllCriteria)
          .set(params)
          .where(eq(dbSchema.couponAllCriteria.id, where.id))
          .returning();
        return typia.assert<ICouponAllCriteria>(couponAllCriteria);

      case 'category':
        const [couponCategoryCriteria] = await db
          .update(dbSchema.couponCategoryCriteria)
          .set(params)
          .where(eq(dbSchema.couponCategoryCriteria.id, where.id))
          .returning();
        return typia.assert<ICouponCategoryCriteria>(couponCategoryCriteria);

      case 'teacher':
        const [couponTeacherCriteria] = await db
          .update(dbSchema.couponTeacherCriteria)
          .set(params)
          .where(eq(dbSchema.couponTeacherCriteria.id, where.id))
          .returning();
        return typia.assert<ICouponTeacherCriteria>(couponTeacherCriteria);

      case 'course':
        const [couponCourseCriteria] = await db
          .update(dbSchema.couponCourseCriteria)
          .set(params)
          .where(eq(dbSchema.couponCourseCriteria.id, where.id))
          .returning();
        return typia.assert<ICouponCourseCriteria>(couponCourseCriteria);

      case 'ebook':
        const [couponEbookCriteria] = await db
          .update(dbSchema.couponEbookCriteria)
          .set(params)
          .where(eq(dbSchema.couponEbookCriteria.id, where.id))
          .returning();
        return typia.assert<ICouponEbookCriteria>(couponEbookCriteria);
    }
  }
}
