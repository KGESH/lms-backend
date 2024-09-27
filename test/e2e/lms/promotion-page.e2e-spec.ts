import { INestApplication } from '@nestjs/common';
import * as PromotionAPI from '../../../src/api/functional/v1/promotion';
import * as typia from 'typia';
import { createTestingServer } from '../helpers/app.helper';
import { Uri } from '../../../src/shared/types/primitive';
import { DrizzleService } from '../../../src/infra/db/drizzle.service';
import { seedUsers } from '../helpers/db/lms/user.helper';
import { ConfigsService } from '../../../src/configs/configs.service';
import { createPromotion } from '../helpers/db/lms/promotion.helper';
import { createCoupon } from '../helpers/db/lms/coupon.helper';
import { ICouponCreate } from '@src/v1/coupon/coupon.interface';
import * as date from '@src/shared/utils/date';

describe('PromotionController (e2e)', () => {
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

  describe('[Get promotion]', () => {
    it('should be get promotion success', async () => {
      const [admin] = await seedUsers({ count: 1, role: 'admin' }, drizzle.db);
      const coupon = await createCoupon(
        typia.random<ICouponCreate>(),
        drizzle.db,
      );
      const promotion = await createPromotion(
        {
          title: 'AAA 프로모션',
          couponId: coupon.id,
          description: null,
          openedAt: null,
          closedAt: null,
        },
        drizzle.db,
      );

      const response = await PromotionAPI.getPromotion(
        {
          host,
          headers: { LmsSecret },
        },
        promotion.id,
      );

      if (!response.success || !response.data) {
        const message = JSON.stringify(response.data, null, 4);
        throw new Error(`[assert] ${message}`);
      }

      const foundPromo = response.data;
      expect(foundPromo.title).toEqual('AAA 프로모션');
    });
  });

  describe('[Get many promotion pages]', () => {
    it('should be get many promotion page success', async () => {
      const [admin] = await seedUsers({ count: 1, role: 'admin' }, drizzle.db);
      const coupon = await createCoupon(
        typia.random<ICouponCreate>(),
        drizzle.db,
      );
      const firstPromotion = await createPromotion(
        {
          couponId: coupon.id,
          title: 'AAA 프로모션',
          description: 'AAA 프로모션 설명',
          openedAt: date.toDate('2222-01-01'),
          closedAt: null,
        },
        drizzle.db,
      );
      const Secondpromotion = await createPromotion(
        {
          couponId: coupon.id,
          title: 'BBB 프로모션',
          description: 'BBB 프로모션 설명',
          openedAt: date.toDate('3333-01-01'),
          closedAt: null,
        },
        drizzle.db,
      );

      const response = await PromotionAPI.getPromotions(
        {
          host,
          headers: { LmsSecret },
        },
        {
          orderByColumn: 'createdAt',
          orderBy: 'desc',
          page: 1,
          pageSize: 10,
        },
      );

      if (!response.success) {
        const message = JSON.stringify(response.data, null, 4);
        throw new Error(`[assert] ${message}`);
      }

      const { pagination, totalCount, data } = response.data;
      expect(totalCount).toEqual(2);
      expect(data[0].title).toEqual('BBB 프로모션');
      expect(data[1].title).toEqual('AAA 프로모션');
    });
  });
});
