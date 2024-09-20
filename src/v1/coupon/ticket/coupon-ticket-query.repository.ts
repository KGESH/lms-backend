import { Injectable } from '@nestjs/common';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import {
  ICouponTicket,
  ICouponTicketPaymentRelations,
  ICouponTicketRelations,
} from '@src/v1/coupon/ticket/coupon-ticket.interface';
import { eq, count, and } from 'drizzle-orm';
import { dbSchema } from '@src/infra/db/schema';
import { UInt } from '@src/shared/types/primitive';
import { Optional } from '@src/shared/types/optional';
import * as typia from 'typia';
import {
  ICouponAllCriteria,
  ICouponCategoryCriteria,
  ICouponCourseCriteria,
  ICouponEbookCriteria,
  ICouponTeacherCriteria,
} from '@src/v1/coupon/criteria/coupon-criteria.interface';
import { assertCoupon } from '@src/shared/helpers/assert/coupon';

@Injectable()
export class CouponTicketQueryRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async findCouponTicketRelations(
    where: Pick<ICouponTicket, 'id'>,
  ): Promise<ICouponTicketRelations | null> {
    const couponTicket = await this.drizzle.db.query.couponTickets.findFirst({
      where: eq(dbSchema.couponTickets.id, where.id),
      with: {
        coupon: {
          with: {
            couponAllCriteria: true,
            couponCategoryCriteria: true,
            couponTeacherCriteria: true,
            couponCourseCriteria: true,
            couponEbookCriteria: true,
          },
        },
      },
    });

    if (!couponTicket) {
      return null;
    }

    const { coupon, ...ticket } = couponTicket;
    return {
      ...assertCoupon(coupon),
      ticket,
      couponAllCriteria: typia.assert<ICouponAllCriteria[]>(
        coupon.couponAllCriteria,
      ),
      couponCategoryCriteria: typia.assert<ICouponCategoryCriteria[]>(
        coupon.couponCategoryCriteria,
      ),
      couponTeacherCriteria: typia.assert<ICouponTeacherCriteria[]>(
        coupon.couponTeacherCriteria,
      ),
      couponCourseCriteria: typia.assert<ICouponCourseCriteria[]>(
        coupon.couponCourseCriteria,
      ),
      couponEbookCriteria: typia.assert<ICouponEbookCriteria[]>(
        coupon.couponEbookCriteria,
      ),
    };
  }

  async findCouponTicketsByUserId(
    where: Pick<ICouponTicket, 'userId'>,
  ): Promise<ICouponTicketPaymentRelations[]> {
    const couponTickets = await this.drizzle.db.query.couponTickets.findMany({
      where: eq(dbSchema.couponTickets.userId, where.userId),
      with: {
        couponTicketPayment: true,
        coupon: {
          with: {
            couponAllCriteria: true,
            couponCategoryCriteria: true,
            couponTeacherCriteria: true,
            couponCourseCriteria: true,
            couponEbookCriteria: true,
          },
        },
      },
    });

    console.log(`[DEBUG]`, JSON.stringify(couponTickets, null, 4));

    return couponTickets.map(({ coupon, ...couponTicket }) => ({
      ...assertCoupon(coupon),
      ticket: couponTicket,
      payment: couponTicket.couponTicketPayment ?? null,
      couponAllCriteria: typia.assert<ICouponAllCriteria[]>(
        coupon.couponAllCriteria,
      ),
      couponCategoryCriteria: typia.assert<ICouponCategoryCriteria[]>(
        coupon.couponCategoryCriteria,
      ),
      couponTeacherCriteria: typia.assert<ICouponTeacherCriteria[]>(
        coupon.couponTeacherCriteria,
      ),
      couponCourseCriteria: typia.assert<ICouponCourseCriteria[]>(
        coupon.couponCourseCriteria,
      ),
      couponEbookCriteria: typia.assert<ICouponEbookCriteria[]>(
        coupon.couponEbookCriteria,
      ),
    }));
  }

  async findCouponTicket(
    where: Pick<ICouponTicket, 'id'>,
  ): Promise<ICouponTicket | null> {
    const couponTicket = await this.drizzle.db.query.couponTickets.findFirst({
      where: eq(dbSchema.couponTickets.id, where.id),
    });

    return couponTicket ?? null;
  }

  // 발급된 쿠폰 티켓 수 조회
  async getIssuedCouponTicketCount(
    where: Optional<Pick<ICouponTicket, 'couponId' | 'userId'>, 'userId'>,
  ): Promise<UInt> {
    const [{ count: issuedTicketCount }] = await this.drizzle.db
      .select({
        count: count(),
      })
      .from(dbSchema.couponTickets)
      .where(
        and(
          eq(dbSchema.couponTickets.couponId, where.couponId),
          where.userId
            ? eq(dbSchema.couponTickets.userId, where.userId)
            : undefined,
        ),
      );

    return issuedTicketCount;
  }
}
