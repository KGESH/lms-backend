import { INestApplication } from '@nestjs/common';
import * as OrderAPI from '../../../src/api/functional/v1/order';
import * as EbookOrderAPI from '../../../src/api/functional/v1/order/ebook';
import * as CourseOrderAPI from '../../../src/api/functional/v1/order/course';
import { createTestingServer } from '../helpers/app.helper';
import { Price, Uri } from '../../../src/shared/types/primitive';
import { DrizzleService } from '../../../src/infra/db/drizzle.service';
import { createRandomEbookProduct } from '../helpers/db/lms/ebook-product.helper';
import { seedUsers } from '../helpers/db/lms/user.helper';
import {
  seedCourseOrders,
  seedEbookOrders,
} from '../helpers/db/lms/order.helper';
import { CreateOrderRefundDto } from '../../../src/v1/order/order-refund.dto';
import { ConfigsService } from '../../../src/configs/configs.service';
import { createRandomCourseProduct } from '../helpers/db/lms/course-product.helper';
import * as typia from 'typia';

describe('OrderController (e2e)', () => {
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

  describe('[Get all orders]', () => {
    it('should be get ebook and course orders success', async () => {
      const seedUser = (await seedUsers({ count: 1 }, drizzle.db))[0];
      await seedCourseOrders({ count: 3 }, drizzle.db, seedUser);
      await seedEbookOrders({ count: 3 }, drizzle.db, seedUser);

      const response = await OrderAPI.getOrders({
        host,
        headers: {
          LmsSecret,
          UserSessionId: seedUser.userSession.id,
        },
      });
      if (!response.success) {
        console.error(response.data);
        throw new Error(`assert - ${JSON.stringify(response.data)}`);
      }

      const orders = response.data;
      const { courses, ebooks } = orders;
      expect(
        courses.every((order) => order.userId === seedUser.user.id),
      ).toEqual(true);
      expect(courses.every((order) => order.course)).toEqual(true);
      expect(
        ebooks.every((order) => order.userId === seedUser.user.id),
      ).toEqual(true);
      expect(ebooks.every((order) => order.ebook)).toEqual(true);
    });
  });

  describe('[Get course orders]', () => {
    it('should be get many course orders success', async () => {
      const seedUser = (await seedUsers({ count: 1 }, drizzle.db))[0];
      await seedCourseOrders({ count: 3 }, drizzle.db, seedUser);

      const response = await CourseOrderAPI.getCourseOrders({
        host,
        headers: {
          LmsSecret,
          UserSessionId: seedUser.userSession.id,
        },
      });
      if (!response.success) {
        console.error(response.data);
        throw new Error(`assert - ${JSON.stringify(response.data)}`);
      }

      const orders = response.data;
      expect(
        orders.every((order) => order.userId === seedUser.user.id),
      ).toEqual(true);
      expect(orders.every((order) => order.course)).toEqual(true);
    });
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
          paymentId: null,
          txId: null,
          paymentMethod: '프로모션 이벤트',
          amount: courseProduct.lastSnapshot!.pricing!.amount,
        },
      );
      if (!response.success) {
        console.error(response.data);
        throw new Error(`assert - ${JSON.stringify(response.data)}`);
      }

      const order = response.data;

      const foundResponse = await CourseOrderAPI.getCourseOrder(
        {
          host,
          headers: {
            LmsSecret,
            UserSessionId: userSession.id,
          },
        },
        order.id,
      );
      if (!foundResponse.success || !foundResponse.data) {
        throw new Error(`assert - ${JSON.stringify(foundResponse.data)}`);
      }

      const foundOrder = foundResponse.data;
      expect(foundOrder.paymentMethod).toEqual('프로모션 이벤트');
      // Order title is the same as the last snapshot title of the product
      expect(foundOrder.title).toEqual(courseProduct!.lastSnapshot!.title);
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
          paymentId: null,
          txId: null,
          paymentMethod: '프로모션 이벤트',
          amount: typia.random<Price>(),
        },
      );
      if (!response.success) {
        console.error(response.data);
        throw new Error(`assert - ${JSON.stringify(response.data)}`);
      }

      const order = response.data;
      expect(order).not.toBeNull();
      expect(order.paymentMethod).toEqual('프로모션 이벤트');
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
        reason: 'mock refund',
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

  describe('[Get ebook orders]', () => {
    it('should be get many ebook orders success', async () => {
      const seedUser = (await seedUsers({ count: 1 }, drizzle.db))[0];
      await seedEbookOrders({ count: 3 }, drizzle.db, seedUser);

      const response = await EbookOrderAPI.getEbookOrders({
        host,
        headers: {
          LmsSecret,
          UserSessionId: seedUser.userSession.id,
        },
      });
      if (!response.success) {
        console.error(response.data);
        throw new Error(`assert - ${JSON.stringify(response.data)}`);
      }

      const orders = response.data;
      expect(
        orders.every((order) => order.userId === seedUser.user.id),
      ).toEqual(true);
      expect(orders.every((order) => order.ebook)).toEqual(true);
    });
  });

  describe('[Get ebook order]', () => {
    it('should be get a ebook order success', async () => {
      const { user, userSession } = (
        await seedUsers({ count: 1 }, drizzle.db)
      )[0];
      const ebookProduct = await createRandomEbookProduct(drizzle.db);

      const response = await EbookOrderAPI.purchaseEbookProduct(
        {
          host,
          headers: {
            LmsSecret,
            UserSessionId: userSession.id,
          },
        },
        {
          userId: user.id,
          ebookId: ebookProduct.ebookId,
          paymentMethod: '프로모션 이벤트',
          paymentId: null,
          txId: null,
          amount: ebookProduct.lastSnapshot!.pricing!.amount,
        },
      );
      if (!response.success) {
        console.error(response.data);
        throw new Error(`assert - ${JSON.stringify(response.data)}`);
      }

      const order = response.data;

      const foundResponse = await EbookOrderAPI.getEbookOrder(
        {
          host,
          headers: {
            LmsSecret,
            UserSessionId: userSession.id,
          },
        },
        order.id,
      );
      if (!foundResponse.success || !foundResponse.data) {
        throw new Error(`assert - ${JSON.stringify(foundResponse.data)}`);
      }

      const foundOrder = foundResponse.data;
      expect(foundOrder.paymentMethod).toEqual('프로모션 이벤트');
      // Order title is the same as the last snapshot title of the product
      expect(foundOrder.title).toEqual(ebookProduct!.lastSnapshot!.title);
    });
  });

  describe('[Create ebook order]', () => {
    it('should be purchase a ebook order success', async () => {
      const { user, userSession } = (
        await seedUsers({ count: 1 }, drizzle.db)
      )[0];
      const ebookProduct = await createRandomEbookProduct(drizzle.db);

      const response = await EbookOrderAPI.purchaseEbookProduct(
        {
          host,
          headers: {
            LmsSecret,
            UserSessionId: userSession.id,
          },
        },
        {
          userId: user.id,
          ebookId: ebookProduct.ebookId,
          paymentMethod: '프로모션 이벤트',
          paymentId: null,
          txId: null,
          amount: ebookProduct!.lastSnapshot!.pricing.amount!,
        },
      );
      if (!response.success) {
        console.error(response.data);
        throw new Error(`assert - ${JSON.stringify(response.data)}`);
      }

      const order = response.data;
      expect(order).not.toBeNull();
      expect(order.paymentMethod).toEqual('프로모션 이벤트');
      expect(order.productType).toEqual('ebook');
    });
  });

  describe('[Refund ebook order]', () => {
    it('should be refund ebook order success', async () => {
      const admin = (
        await seedUsers({ count: 1, role: 'admin' }, drizzle.db)
      )[0];

      const { order } = (await seedEbookOrders({ count: 1 }, drizzle.db))[0];
      const createOrderRefundDto: CreateOrderRefundDto = {
        amount: '10000',
        reason: 'mock refund reason',
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
