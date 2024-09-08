import { INestApplication } from '@nestjs/common';
import * as EbookOrderAPI from '../../../src/api/functional/v1/order/ebook';
import * as OrderAPI from '../../../src/api/functional/v1/order';
import { createTestingServer } from '../helpers/app.helper';
import { Uri } from '../../../src/shared/types/primitive';
import { DrizzleService } from '../../../src/infra/db/drizzle.service';
import { createRandomEbookProduct } from '../helpers/db/lms/ebook-product.helper';
import { seedUsers } from '../helpers/db/lms/user.helper';
import { seedEbookOrders } from '../helpers/db/lms/order.helper';
import { CreateOrderRefundDto } from '../../../src/v1/order/order-refund.dto';
import { ConfigsService } from '../../../src/configs/configs.service';

describe('EbookOrderController (e2e)', () => {
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

      const foundResponse = await OrderAPI.getOrder(
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
