import { INestApplication } from '@nestjs/common';
import * as PromotionDashboardAPI from '../../../src/api/functional/v1/dashboard/promotion';
import * as typia from 'typia';
import { createTestingServer } from '../helpers/app.helper';
import { Uri, Uuid } from '../../../src/shared/types/primitive';
import { DrizzleService } from '../../../src/infra/db/drizzle.service';
import { seedUsers } from '../helpers/db/lms/user.helper';
import { ConfigsService } from '../../../src/configs/configs.service';
import { createCoupon } from '../helpers/db/lms/coupon.helper';
import { ICouponCreate } from '@src/v1/coupon/coupon.interface';
import { CreatePromotionPageDto } from '@src/v1/promotion/promotion.dto';
import { createManyFiles } from '../helpers/db/lms/file.helper';

describe('PromotionDashboardController (e2e)', () => {
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

  describe('[Create promotion page]', () => {
    it('should be create promotion page success', async () => {
      const [admin] = await seedUsers({ count: 1, role: 'admin' }, drizzle.db);

      const coupon = await createCoupon(
        typia.random<ICouponCreate>(),
        drizzle.db,
      );

      const [file] = await createManyFiles(
        [
          {
            id: typia.random<Uuid>(),
            filename: 'AAA_프로모션_이미지.png',
            metadata: null,
            type: 'image',
            url: typia.random<Uri>(),
          },
        ],
        drizzle.db,
      );

      const createDto: CreatePromotionPageDto = {
        title: 'AAA 프로모션 이벤트 페이지',
        couponId: coupon.id,
        description: null,
        openedAt: null,
        closedAt: null,
        contents: [
          {
            title: 'AAA 프로모션 이벤트',
            description: 'AAA 프로모션 이벤트 설명',
            fileId: null,
            sequence: 1,
            type: 'text',
          },
          {
            title: 'AAA 프로모션 이벤트 이미지',
            description: 'AAA 프로모션 이벤트 이미지 설명',
            fileId: file.id,
            sequence: 1,
            type: 'image',
          },
        ],
      };

      const response = await PromotionDashboardAPI.createPromotion(
        {
          host,
          headers: { LmsSecret, UserSessionId: admin.userSession.id },
        },
        createDto,
      );

      if (!response.success || !response.data) {
        const message = JSON.stringify(response.data, null, 4);
        throw new Error(`[assert] ${message}`);
      }

      const createdPromotionPage = response.data;
      expect(createdPromotionPage.title).toEqual('AAA 프로모션 이벤트 페이지');
    });
  });
});
