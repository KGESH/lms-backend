import { INestApplication } from '@nestjs/common';
import * as CourseOrderAPI from '../../../src/api/functional/v1/order/course';
import * as OrderAPI from '../../../src/api/functional/v1/order';
import * as typia from 'typia';
import { createTestingServer } from '../helpers/app.helper';
import { Price, Uri } from '../../../src/shared/types/primitive';
import { DrizzleService } from '../../../src/infra/db/drizzle.service';
import { createRandomCourseProduct } from '../helpers/db/lms/course-product.helper';
import { seedUsers } from '../helpers/db/lms/user.helper';
import { seedCourseOrders } from '../helpers/db/lms/order.helper';
import { CreateOrderRefundDto } from '../../../src/v1/order/order-refund.dto';
import { ConfigsService } from '../../../src/configs/configs.service';

describe('CourseOrderController (e2e)', () => {
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

  describe('[Get course order]', () => {
    it('should be get a course order success', async () => {
      const { user, userSession } = (
        await seedUsers({ count: 1 }, drizzle.db)
      )[0];
      const courseProduct = await createRandomCourseProduct(drizzle.db);

      const response = await CourseOrderAPI.purchaseCourseProduct(
        {
          host,
          headers: {
            LmsSecret,
            UserSessionId: userSession.id,
          },
        },
        {
          userId: user.id,
          courseId: courseProduct.courseId,
          paymentMethod: '신용카드',
          amount: typia.random<Price>(),
        },
      );
      if (!response.success) {
        console.error(response.data);
        throw new Error(`assert - ${JSON.stringify(response.data)}`);
      }

      const order = response.data;

      const foundOrder = await OrderAPI.getOrder(
        {
          host,
          headers: {
            LmsSecret,
            UserSessionId: userSession.id,
          },
        },
        order.id,
      );
      if (!foundOrder.success) {
        console.error(foundOrder.data);
        throw new Error(`assert - ${JSON.stringify(foundOrder.data)}`);
      }

      expect(foundOrder.data!.paymentMethod).toEqual('신용카드');
    });
  });

  describe('[Create course order]', () => {
    it('should be purchase a course order success', async () => {
      const { user, userSession } = (
        await seedUsers({ count: 1 }, drizzle.db)
      )[0];
      const courseProduct = await createRandomCourseProduct(drizzle.db);

      const response = await CourseOrderAPI.purchaseCourseProduct(
        {
          host,
          headers: {
            LmsSecret,
            UserSessionId: userSession.id,
          },
        },
        {
          userId: user.id,
          courseId: courseProduct.courseId,
          paymentMethod: '신용카드',
          amount: typia.random<Price>(),
        },
      );
      if (!response.success) {
        console.error(response.data);
        throw new Error(`assert - ${JSON.stringify(response.data)}`);
      }

      const order = response.data;
      expect(order).not.toBeNull();
      expect(order.paymentMethod).toEqual('신용카드');
      expect(order.productType).toEqual('course');
    });
  });

  describe('[Refund course order]', () => {
    it('should be refund course order success', async () => {
      const admin = (
        await seedUsers({ count: 1, role: 'admin' }, drizzle.db)
      )[0];

      const { order } = (await seedCourseOrders({ count: 1 }, drizzle.db))[0];
      const createOrderRefundDto: CreateOrderRefundDto = {
        amount: '10000',
      };

      const response = await OrderAPI.refund.refundOrder(
        {
          host,
          headers: {
            LmsSecret,
            UserSessionId: admin.userSession.id,
          },
        },
        order.id,
        createOrderRefundDto,
      );

      if (!response.success) {
        console.error(response.data);
        throw new Error(`assert - ${JSON.stringify(response.data)}`);
      }

      const refundOrder = response.data;
      expect(refundOrder.amount).toEqual('10000');
    });
  });
});
