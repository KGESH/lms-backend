import { Injectable } from '@nestjs/common';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import {
  ICouponTicket,
  ICouponTicketPagination,
  ICouponTicketPaymentRelations,
  ICouponTicketRelations,
} from '@src/v1/coupon/ticket/coupon-ticket.interface';
import { eq, count, and, inArray } from 'drizzle-orm';
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
import { Paginated } from '@src/shared/types/pagination';
import { assertUserWithoutPassword } from '@src/shared/helpers/assert/user';

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

  async findCouponTicketPaymentRelations(
    where: Pick<ICouponTicket, 'id'>,
  ): Promise<ICouponTicketPaymentRelations | null> {
    const couponTicket = await this.drizzle.db.query.couponTickets.findFirst({
      where: eq(dbSchema.couponTickets.id, where.id),
      with: {
        user: true, // Ticket owner
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

    if (!couponTicket) {
      return null;
    }

    const { coupon, ...ticket } = couponTicket;
    return {
      ...assertCoupon(coupon),
      ticket,
      user: assertUserWithoutPassword(ticket.user),
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
    };
  }

  async findManyCouponTicketsRelations(
    where: Pick<ICouponTicket, 'couponId'> & {
      userIds?: ICouponTicket['userId'][];
    },
    pagination: ICouponTicketPagination,
  ): Promise<Paginated<ICouponTicketPaymentRelations[]>> {
    const ticketQueryFilter = and(
      eq(dbSchema.couponTickets.couponId, where.couponId),
      where?.userIds
        ? inArray(dbSchema.couponTickets.userId, where.userIds)
        : undefined,
    );
    const ticketTotalCountFilter = eq(
      dbSchema.couponTickets.couponId,
      where.couponId,
    );

    const [[{ totalCount }], couponTickets] = await this.drizzle.db.transaction(
      async (tx) => {
        const totalCountQuery = tx
          .select({ totalCount: count() })
          .from(dbSchema.couponTickets)
          .where(ticketTotalCountFilter);

        const query = tx.query.couponTickets.findMany({
          where: ticketQueryFilter,
          with: {
            user: true, // Ticket owner
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
          orderBy: (ticket, { asc, desc }) =>
            pagination.orderBy === 'asc'
              ? asc(ticket[pagination.orderByColumn])
              : desc(ticket[pagination.orderByColumn]),
          offset: (pagination.page - 1) * pagination.pageSize,
          limit: pagination.pageSize,
        });

        return await Promise.all([totalCountQuery, query]);
      },
    );

    return {
      pagination,
      totalCount: totalCount ?? 0,
      data: couponTickets.map(({ coupon, ...couponTicket }) => ({
        ...assertCoupon(coupon),
        ticket: couponTicket,
        user: assertUserWithoutPassword(couponTicket.user),
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
      })),
    };
  }

  async findCouponTicketsByUserId(
    where: Pick<ICouponTicket, 'userId'>,
  ): Promise<ICouponTicketPaymentRelations[]> {
    const couponTickets = await this.drizzle.db.query.couponTickets.findMany({
      where: eq(dbSchema.couponTickets.userId, where.userId),
      with: {
        user: true, // Ticket owner
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

    return couponTickets.map(({ coupon, ...couponTicket }) => ({
      ...assertCoupon(coupon),
      ticket: couponTicket,
      user: assertUserWithoutPassword(couponTicket.user),
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
