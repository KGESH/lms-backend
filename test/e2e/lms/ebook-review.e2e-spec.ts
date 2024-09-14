import { INestApplication } from '@nestjs/common';
import { createTestingServer } from '../helpers/app.helper';
import { Uri } from '../../../src/shared/types/primitive';
import { DrizzleService } from '../../../src/infra/db/drizzle.service';
import {
  createRandomEbookReview,
  seedEbookReviews,
} from '../helpers/db/lms/review.helper';
import { seedEbookOrders } from '../helpers/db/lms/order.helper';
import * as EbookReviewAPI from '../../../src/api/functional/v1/review/ebook';
import { CreateEbookReviewDto } from '../../../src/v1/review/ebook-review/ebook-review.dto';
import { ConfigsService } from '../../../src/configs/configs.service';

describe('EbookReviewController (e2e)', () => {
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

  describe('[Get ebook review]', () => {
    it('should be get ebook review success', async () => {
      const { user, order, product } = (
        await seedEbookOrders({ count: 1 }, drizzle.db)
      )[0];
      const review = await createRandomEbookReview(
        {
          ebookId: product.ebookId,
          orderId: order.id,
          productType: order.productType,
          reviewer: user,
        },
        drizzle.db,
      );

      const response = await EbookReviewAPI.getEbookReviewsByEbookId(
        {
          host,
          headers: { LmsSecret },
        },
        product.ebookId,
        {
          page: 1,
          pageSize: 10,
          orderBy: 'desc',
        },
      );
      if (!response.success) {
        const message = JSON.stringify(response.data, null, 4);
        throw new Error(`[assert] ${message}`);
      }

      const foundReviews = response.data;
      expect(
        foundReviews.find((foundReview) => foundReview.id === review.id),
      ).toBeDefined();
    });
  });

  describe('[Get ebook reviews]', () => {
    it('should be get many ebook reviews success', async () => {
      const SEED_REVIEW_COUNT = 3;
      const reviews = await seedEbookReviews(
        { count: SEED_REVIEW_COUNT },
        drizzle.db,
      );

      const response = await EbookReviewAPI.getEbookReviews(
        {
          host,
          headers: { LmsSecret },
        },
        {
          page: 1,
          pageSize: 10,
          orderBy: 'desc',
        },
      );
      if (!response.success) {
        const message = JSON.stringify(response.data, null, 4);
        throw new Error(`[assert] ${message}`);
      }

      const foundReviews = response.data;
      expect(
        foundReviews.find((review) => review.id === reviews[0].id),
      ).toBeDefined();
      expect(foundReviews.filter((review) => review.user).length).toEqual(
        SEED_REVIEW_COUNT,
      );
    });
  });

  describe('[Create review]', () => {
    it('should be create ebook review success', async () => {
      const { order, product, userSession } = (
        await seedEbookOrders({ count: 1 }, drizzle.db)
      )[0];
      const reviewCreateParams: CreateEbookReviewDto = {
        comment: 'Mock review comment',
        userId: order.userId,
        ebookId: product.ebookId,
        rating: 5,
      };

      const response = await EbookReviewAPI.createEbookReview(
        {
          host,
          headers: {
            LmsSecret,
            UserSessionId: userSession.id,
          },
        },
        reviewCreateParams,
      );
      if (!response.success) {
        const message = JSON.stringify(response.data, null, 5);
        throw new Error(`[assert] ${message}`);
      }

      const createdReview = response.data;
      expect(createdReview.snapshot.comment).toEqual('Mock review comment');
      expect(createdReview.snapshot.rating).toEqual(5);
    });
  });
});
