import { INestApplication } from '@nestjs/common';
import * as UserCouponAPI from '@src/api/functional/v1/user/coupon/ticket';
import { createTestingServer } from '../helpers/app.helper';
import { Uri } from '@src/shared/types/primitive';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import { ConfigsService } from '@src/configs/configs.service';
import { seedUsers } from '../helpers/db/lms/user.helper';
import { seedCoupons } from '../helpers/db/lms/coupon.helper';
import { CreateCouponTicketDto } from '@src/v1/coupon/ticket/coupon-ticket.dto';

describe('UserCouponController (e2e)', () => {
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

  describe('[Get user coupons]', () => {
    it('should be get many user coupons', async () => {
      const [couponOwner] = await seedUsers(
        { count: 1, role: 'user' },
        drizzle.db,
      );
      const SEED_COUNT = 3;
      await seedCoupons(
        { count: SEED_COUNT, user: couponOwner.user },
        drizzle.db,
      );

      const response = await UserCouponAPI.getUserCoupons({
        host,
        headers: {
          LmsSecret,
          UserSessionId: couponOwner.userSession.id,
        },
      });
      if (!response.success) {
        const message = JSON.stringify(response.data, null, 4);
        throw new Error(`assert - ${message}`);
      }

      const foundUserCoupons = response.data;
      expect(foundUserCoupons.length).toEqual(SEED_COUNT);
      expect(foundUserCoupons[0].userId).toEqual(couponOwner.user.id);
    });
  });

  describe('[Create user coupon]', () => {
    it('should be create a user coupon success', async () => {
      const [couponOwner] = await seedUsers(
        { count: 1, role: 'user' },
        drizzle.db,
      );
      const SEED_COUNT = 1;
      const [couponRelations] = await seedCoupons(
        { count: SEED_COUNT },
        drizzle.db,
      );

      const createUserCouponTicketDto: Omit<CreateCouponTicketDto, 'userId'> = {
        type: 'public',
        couponId: couponRelations.id,
      };

      const response = await UserCouponAPI.issueCouponTicket(
        {
          host,
          headers: {
            LmsSecret,
            UserSessionId: couponOwner.userSession.id,
          },
        },
        createUserCouponTicketDto,
      );
      if (!response.success) {
        const message = JSON.stringify(response.data, null, 4);
        throw new Error(`assert - ${message}`);
      }

      const issuedCoupon = response.data;
      expect(issuedCoupon.couponId).toEqual(couponRelations.id);
    });
  });
});
