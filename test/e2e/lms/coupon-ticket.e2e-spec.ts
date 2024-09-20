import { INestApplication } from '@nestjs/common';
import * as CouponTicketAPI from '@src/api/functional/v1/coupon/ticket';
import { createTestingServer } from '../helpers/app.helper';
import { Uri } from '@src/shared/types/primitive';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import { ConfigsService } from '@src/configs/configs.service';
import { seedUsers } from '../helpers/db/lms/user.helper';
import { seedCoupons } from '../helpers/db/lms/coupon.helper';

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

  // 미완성
  // describe('[Get coupon tickets]', () => {
  //   it('should be get many coupon tickets', async () => {
  //     const [admin] = await seedUsers({ count: 1, role: 'admin' }, drizzle.db);
  //     const [couponOwner] = await seedUsers(
  //       { count: 1, role: 'user' },
  //       drizzle.db,
  //     );
  //     const SEED_COUNT = 1;
  //     const [couponRelations] = await seedCoupons(
  //       { count: SEED_COUNT, user: couponOwner.user },
  //       drizzle.db,
  //     );
  //
  //     const response = await CouponTicketAPI.getCouponTickets(
  //       {
  //         host,
  //         headers: {
  //           LmsSecret,
  //           UserSessionId: admin.userSession.id,
  //         },
  //       },
  //       couponRelations.id,
  //     );
  //     if (!response.success || !response.data) {
  //       const message = JSON.stringify(response.data, null, 4);
  //       throw new Error(`assert - ${message}`);
  //     }
  //
  //     const foundCouponTickets = response.data;
  //     console.log(`[foundCouponTickets]`, foundCouponTickets);
  //     expect(foundCouponTickets[0].couponId).toEqual(couponRelations.id);
  //     expect(foundCouponTickets[0].userId).toEqual(couponOwner.user.id);
  //   });
  // });

  // 미완성
  // describe('[Get coupon ticket]', () => {
  //   it('should be a coupon ticket success', async () => {
  //     const [admin] = await seedUsers({ count: 1, role: 'admin' }, drizzle.db);
  //     const [couponOwner] = await seedUsers(
  //       { count: 1, role: 'user' },
  //       drizzle.db,
  //     );
  //     const [couponRelations] = await seedCoupons(
  //       { count: 1, user: couponOwner.user },
  //       drizzle.db,
  //     );
  //
  //     const response = await CouponTicketAPI.getCouponTicket(
  //       {
  //         host,
  //         headers: {
  //           LmsSecret,
  //           UserSessionId: admin.userSession.id,
  //         },
  //       },
  //       couponRelations.id,
  //       couponRelations.ticket.id,
  //     );
  //     if (!response.success || !response.data) {
  //       const message = JSON.stringify(response.data, null, 4);
  //       throw new Error(`assert - ${message}`);
  //     }
  //
  //     const foundCouponTicket = response.data;
  //     expect(foundCouponTicket.userId).toEqual(couponOwner.user.id);
  //   });
  // });

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
