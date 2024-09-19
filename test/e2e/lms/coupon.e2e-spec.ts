import { INestApplication } from '@nestjs/common';
import * as CouponAPI from '@src/api/functional/v1/coupon';
import { createTestingServer } from '../helpers/app.helper';
import { Uri } from '@src/shared/types/primitive';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import { ConfigsService } from '@src/configs/configs.service';
import { seedUsers } from '../helpers/db/lms/user.helper';
import { createCoupon, seedCoupons } from '../helpers/db/lms/coupon.helper';
import { ICouponCreate } from '@src/v1/coupon/coupon.interface';
import * as typia from 'typia';
import { CreateCouponDto, UpdateCouponDto } from '@src/v1/coupon/coupon.dto';

describe('CouponController (e2e)', () => {
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

  describe('[Get coupons]', () => {
    it('should be get many coupons', async () => {
      const [admin] = await seedUsers({ count: 1, role: 'admin' }, drizzle.db);
      const SEED_COUNT = 3;
      await seedCoupons({ count: SEED_COUNT }, drizzle.db);

      const response = await CouponAPI.getCoupons(
        {
          host,
          headers: {
            LmsSecret,
            UserSessionId: admin.userSession.id,
          },
        },
        {
          orderByColumn: 'expiredAt',
          orderBy: 'asc',
          page: 1,
          pageSize: 10,
        },
      );
      if (!response.success || !response.data) {
        const message = JSON.stringify(response.data, null, 4);
        throw new Error(`assert - ${message}`);
      }

      const foundCoupons = response.data;
      expect(foundCoupons.length).toEqual(SEED_COUNT);
    });
  });

  describe('[Get coupon]', () => {
    it('should be a coupon success', async () => {
      const [admin] = await seedUsers({ count: 1, role: 'admin' }, drizzle.db);
      const seedCoupon = await createCoupon(
        {
          ...typia.random<ICouponCreate>(),
          name: '30% coupon',
          value: `30`,
          discountType: 'percent',
        },
        drizzle.db,
      );

      const response = await CouponAPI.getCoupon(
        {
          host,
          headers: {
            LmsSecret,
            UserSessionId: admin.userSession.id,
          },
        },
        seedCoupon.id,
      );
      if (!response.success || !response.data) {
        const message = JSON.stringify(response.data, null, 4);
        throw new Error(`assert - ${message}`);
      }

      const foundCoupon = response.data;
      expect(foundCoupon.name).toEqual('30% coupon');
    });
  });

  describe('[Create coupon]', () => {
    it('should be a create coupon success', async () => {
      const [admin] = await seedUsers({ count: 1, role: 'admin' }, drizzle.db);

      const createCouponDto: CreateCouponDto = {
        name: '30% coupon',
        value: '30',
        discountType: 'percent',
        description: null,
        expiredAt: null,
        expiredIn: null,
        limit: null,
        openedAt: null,
        threshold: null,
        volume: null,
        closedAt: null,
        volumePerCitizen: null,
      };

      const response = await CouponAPI.createCoupon(
        {
          host,
          headers: {
            LmsSecret,
            UserSessionId: admin.userSession.id,
          },
        },
        createCouponDto,
      );
      if (!response.success || !response.data) {
        const message = JSON.stringify(response.data, null, 4);
        throw new Error(`assert - ${message}`);
      }

      const createdCoupon = response.data;
      expect(createdCoupon.name).toEqual('30% coupon');
      expect(createdCoupon.value).toEqual('30');
    });
  });

  describe('[Update coupon]', () => {
    it('should be a create coupon success', async () => {
      const [admin] = await seedUsers({ count: 1, role: 'admin' }, drizzle.db);
      const seedCoupon = await createCoupon(
        {
          ...typia.random<ICouponCreate>(),
          name: '30% coupon',
          value: `30`,
          discountType: 'percent',
        },
        drizzle.db,
      );

      const updateCouponDto: UpdateCouponDto = {
        name: '90% coupon',
        value: '90',
      };

      const response = await CouponAPI.updateCoupon(
        {
          host,
          headers: {
            LmsSecret,
            UserSessionId: admin.userSession.id,
          },
        },
        seedCoupon.id,
        updateCouponDto,
      );
      if (!response.success || !response.data) {
        const message = JSON.stringify(response.data, null, 4);
        throw new Error(`assert - ${message}`);
      }

      const createdCoupon = response.data;
      expect(createdCoupon.name).toEqual('90% coupon');
      expect(createdCoupon.value).toEqual('90');
    });
  });

  describe('[Delete coupon]', () => {
    it('should be a create coupon success', async () => {
      const [admin] = await seedUsers({ count: 1, role: 'admin' }, drizzle.db);
      const seedCoupon = await createCoupon(
        {
          ...typia.random<ICouponCreate>(),
          name: '30% coupon',
          value: `30`,
          discountType: 'percent',
        },
        drizzle.db,
      );

      const response = await CouponAPI.deleteCoupon(
        {
          host,
          headers: {
            LmsSecret,
            UserSessionId: admin.userSession.id,
          },
        },
        seedCoupon.id,
      );
      if (!response.success || !response.data) {
        const message = JSON.stringify(response.data, null, 4);
        throw new Error(`assert - ${message}`);
      }

      const deletedCoupon = response.data;
      expect(deletedCoupon.id).toEqual(seedCoupon.id);
    });
  });
});
