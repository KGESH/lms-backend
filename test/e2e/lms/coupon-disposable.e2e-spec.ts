import { INestApplication } from '@nestjs/common';
import * as CouponDisposableAPI from '@src/api/functional/v1/coupon/disposable';
import { createTestingServer } from '../helpers/app.helper';
import { Uri } from '@src/shared/types/primitive';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import { ConfigsService } from '@src/configs/configs.service';
import { seedUsers } from '../helpers/db/lms/user.helper';
import {
  createCouponDisposable,
  createCouponTicket,
  seedCoupons,
} from '../helpers/db/lms/coupon.helper';
import { CreateCouponDisposableDto } from '@src/v1/coupon/disposable/coupon-disposable.dto';

describe('CouponDisposableController (e2e)', () => {
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

  describe('[Get coupon disposables]', () => {
    it('should be get many disposables', async () => {
      const [admin] = await seedUsers({ count: 1, role: 'admin' }, drizzle.db);
      const [couponOwner] = await seedUsers(
        { count: 1, role: 'user' },
        drizzle.db,
      );
      const SEED_COUNT = 1;
      const [couponRelations] = await seedCoupons(
        { count: SEED_COUNT, user: couponOwner.user },
        drizzle.db,
      );
      const seedDisposable = await createCouponDisposable(
        {
          code: 'ABC-EFG',
          couponId: couponRelations.id,
          expiredAt: null,
        },
        drizzle.db,
      );
      const issuedPrivateCouponTicket = await createCouponTicket(
        {
          userId: couponOwner.user.id,
          couponDisposableId: seedDisposable.id,
          couponId: seedDisposable.couponId,
          expiredAt: null,
        },
        drizzle.db,
      );

      const response = await CouponDisposableAPI.getCouponDisposables(
        {
          host,
          headers: {
            LmsSecret,
            UserSessionId: admin.userSession.id,
          },
        },
        couponRelations.id,
        {
          code: 'C-EF', // code로 패턴 매칭 검색
          orderBy: 'desc',
          page: 1,
          pageSize: 10,
        },
      );
      if (!response.success || !response.data) {
        const message = JSON.stringify(response.data, null, 4);
        throw new Error(`assert - ${message}`);
      }

      const paginatedCouponDisposables = response.data;
      const foundCouponDisposables = paginatedCouponDisposables.data;
      expect(foundCouponDisposables[0].couponId).toEqual(couponRelations.id);
      expect(foundCouponDisposables[0].code).toEqual('ABC-EFG');
      expect(paginatedCouponDisposables.totalCount).toEqual(SEED_COUNT);
      expect(paginatedCouponDisposables.pagination).toEqual({
        orderBy: 'desc',
        page: 1,
        pageSize: 10,
      });
      expect(foundCouponDisposables[0]!.issuedTicket!.id).toEqual(
        issuedPrivateCouponTicket.id,
      );
    });
  });

  describe('[Get coupon disposable by id]', () => {
    it('should be a coupon disposable success', async () => {
      const [admin] = await seedUsers({ count: 1, role: 'admin' }, drizzle.db);
      const [couponRelations] = await seedCoupons({ count: 1 }, drizzle.db);
      const seedDisposable = await createCouponDisposable(
        {
          code: 'ABC-EFG',
          couponId: couponRelations.id,
          expiredAt: null,
        },
        drizzle.db,
      );

      const response = await CouponDisposableAPI.getCouponDisposableById(
        {
          host,
          headers: {
            LmsSecret,
            UserSessionId: admin.userSession.id,
          },
        },
        couponRelations.id,
        seedDisposable.id,
      );
      if (!response.success || !response.data) {
        const message = JSON.stringify(response.data, null, 4);
        throw new Error(`assert - ${message}`);
      }

      const foundCouponDisposable = response.data;
      expect(foundCouponDisposable.couponId).toEqual(couponRelations.id);
      expect(foundCouponDisposable.code).toEqual('ABC-EFG');
    });
  });

  describe('[Create many coupon disposable]', () => {
    it('should be create many coupon disposable success', async () => {
      const [admin] = await seedUsers({ count: 1, role: 'admin' }, drizzle.db);
      const [couponRelations] = await seedCoupons({ count: 1 }, drizzle.db);

      const createCouponTicketDto: CreateCouponDisposableDto = {
        count: 5,
        expiredAt: null,
      };

      const response = await CouponDisposableAPI.createCouponDisposables(
        {
          host,
          headers: {
            LmsSecret,
            UserSessionId: admin.userSession.id,
          },
        },
        couponRelations.id,
        createCouponTicketDto,
      );
      if (!response.success || !response.data) {
        const message = JSON.stringify(response.data, null, 4);
        throw new Error(`assert - ${message}`);
      }

      const createCouponDisposables = response.data;
      expect(createCouponDisposables[0].couponId).toEqual(couponRelations.id);
    });
  });
});
