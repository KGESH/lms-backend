import { INestApplication } from '@nestjs/common';
import * as CouponTicketAPI from '@src/api/functional/v1/coupon/ticket';
import { createTestingServer } from '../helpers/app.helper';
import { Uri } from '@src/shared/types/primitive';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import { ConfigsService } from '@src/configs/configs.service';
import { seedUsers } from '../helpers/db/lms/user.helper';
import {
  createCouponTicket,
  seedCoupons,
} from '../helpers/db/lms/coupon.helper';

describe('CouponTicketController (e2e)', () => {
  let host: Uri;
  let app: INestApplication;
  let drizzle: DrizzleService;
  let configs: ConfigsService;
  let LmsSecret: string;

  beforeEach(async () => {
    app = await createTestingServer();
    host = await app.getUrl();
    drizzle = await app.get(DrizzleService);
    configs = await app.get(ConfigsService);
    LmsSecret = configs.env.LMS_SECRET;
  });

  afterEach(async () => {
    await app.close();
  });

  describe('[Get coupon tickets]', () => {
    it('should be get many coupon tickets', async () => {
      const [admin] = await seedUsers({ count: 1, role: 'admin' }, drizzle.db);
      const [couponOwner] = await seedUsers(
        { count: 1, role: 'user' },
        drizzle.db,
      );
      const [couponRelations] = await seedCoupons({ count: 1 }, drizzle.db);
      const SEED_RANDOM_USER_COUPON_COUNT = 5;
      const randomUsersTickets = [
        couponRelations.ticket, // Seed ticket
        ...(await Promise.all(
          Array.from({ length: SEED_RANDOM_USER_COUPON_COUNT - 1 }) // (5 - (Seed coupon with ticket)) === (5 - 1)
            .map(() =>
              createCouponTicket(
                {
                  couponId: couponRelations.id,
                  userId: couponOwner.user.id,
                  expiredAt: null,
                  couponDisposableId: null,
                },
                drizzle.db,
              ),
            ),
        )),
      ];
      const SEED_COUPON_OWNER_TICKET_COUNT = 5;
      const couponOwnerTickets = [
        ...(await Promise.all(
          Array.from({ length: SEED_COUPON_OWNER_TICKET_COUNT }).map(() =>
            createCouponTicket(
              {
                couponId: couponRelations.id,
                userId: couponOwner.user.id,
                expiredAt: null,
                couponDisposableId: null,
              },
              drizzle.db,
            ),
          ),
        )),
      ];

      const ticketsResponse = await CouponTicketAPI.getCouponTickets(
        {
          host,
          headers: {
            LmsSecret,
            UserSessionId: admin.userSession.id,
          },
        },
        couponRelations.id,
        {
          // 쿠폰 페이지네이션
          orderBy: 'desc',
          page: 1,
          pageSize: 5,
          orderByColumn: 'createdAt',
          // 쿠폰 티켓 소유자 필터링
          userFilterType: undefined,
          userFilterValue: undefined,
        },
      );
      if (!ticketsResponse.success) {
        const message = JSON.stringify(ticketsResponse.data, null, 4);
        throw new Error(`assert - ${message}`);
      }

      const paginatedRandomTickets = ticketsResponse.data;
      expect(paginatedRandomTickets.totalCount).toEqual(
        SEED_RANDOM_USER_COUPON_COUNT + SEED_COUPON_OWNER_TICKET_COUNT,
      );

      const filteredResponse = await CouponTicketAPI.getCouponTickets(
        {
          host,
          headers: {
            LmsSecret,
            UserSessionId: admin.userSession.id,
          },
        },
        couponRelations.id,
        {
          // 쿠폰 페이지네이션
          orderBy: 'desc',
          page: 1,
          pageSize: 10,
          orderByColumn: 'createdAt',
          // 쿠폰 티켓 소유자 필터링
          userFilterType: 'email',
          userFilterValue: couponOwner.user.email.slice(0, 2), // 쿠폰 소유자 이메일 부분 검색
        },
      );
      if (!filteredResponse.success) {
        const message = JSON.stringify(filteredResponse.data, null, 4);
        throw new Error(`assert - ${message}`);
      }

      const {
        pagination,
        totalCount,
        data: foundCouponsRelations,
      } = filteredResponse.data;
      expect(totalCount).toEqual(
        SEED_RANDOM_USER_COUPON_COUNT + SEED_COUPON_OWNER_TICKET_COUNT,
      );
      expect(pagination).toEqual({ orderBy: 'desc', page: 1, pageSize: 10 });
      expect(foundCouponsRelations[0].id).toEqual(couponRelations.id);
      expect(foundCouponsRelations[0].ticket.userId).toEqual(
        couponOwner.user.id,
      );
      expect(foundCouponsRelations[0].payment).toBeNull();
      expect(foundCouponsRelations[0].user.email).toEqual(
        couponOwner.user.email,
      );
    });
  });

  describe('[Get coupon ticket]', () => {
    it('should be a coupon ticket success', async () => {
      const [admin] = await seedUsers({ count: 1, role: 'admin' }, drizzle.db);
      const [couponOwner] = await seedUsers(
        { count: 1, role: 'user' },
        drizzle.db,
      );
      const [couponRelations] = await seedCoupons(
        { count: 1, user: couponOwner.user },
        drizzle.db,
      );

      const response = await CouponTicketAPI.getCouponTicket(
        {
          host,
          headers: {
            LmsSecret,
            UserSessionId: admin.userSession.id,
          },
        },
        couponRelations.id,
        couponRelations.ticket.id,
      );
      if (!response.success || !response.data) {
        const message = JSON.stringify(response.data, null, 4);
        throw new Error(`assert - ${message}`);
      }

      const foundCouponRelations = response.data;
      expect(foundCouponRelations.ticket.userId).toEqual(couponOwner.user.id);
      expect(foundCouponRelations.payment).toBeNull(); // 쿠폰을 발급하고 결제에 사용하지 않은 상태.
    });
  });

  describe('[Create coupon ticket]', () => {
    it('should be a create coupon ticket success', async () => {
      const [couponIssuer] = await seedUsers(
        { count: 1, role: 'user' },
        drizzle.db,
      );

      const [couponRelations] = await seedCoupons(
        { count: 1, user: couponIssuer.user },
        drizzle.db,
      );

      const response = await CouponTicketAPI.createPublicCouponTicket(
        {
          host,
          headers: {
            LmsSecret,
            UserSessionId: couponIssuer.userSession.id,
          },
        },
        couponRelations.id,
        {
          type: 'public',
          userId: couponIssuer.user.id,
        },
      );
      if (!response.success || !response.data) {
        const message = JSON.stringify(response.data, null, 4);
        throw new Error(`assert - ${message}`);
      }

      const createdCouponTicket = response.data;
      expect(createdCouponTicket.id).toEqual(couponRelations.id);
      expect(createdCouponTicket.ticket.userId).toEqual(couponIssuer.user.id);
    });
  });
});
