import { INestApplication } from '@nestjs/common';
import { createTestingServer } from '../helpers/app.helper';
import { Uri } from '../../../src/shared/types/primitive';
import { DrizzleService } from '../../../src/infra/db/drizzle.service';
import {
  createRandomCourseReview,
  seedCourseReviews,
} from '../helpers/db/lms/review.helper';
import { seedCourseOrders } from '../helpers/db/lms/order.helper';
import * as CourseReviewAPI from '../../../src/api/functional/v1/review/course';
import { ConfigsService } from '../../../src/configs/configs.service';
import { CreateReviewDto } from '../../../src/v1/review/review.dto';

describe('CourseReviewController (e2e)', () => {
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

  describe('[Get course review]', () => {
    it('should be get course review success', async () => {
      const { order, user, product } = (
        await seedCourseOrders({ count: 1 }, drizzle.db)
      )[0];
      const review = await createRandomCourseReview(
        {
          courseId: product.courseId,
          orderId: order.id,
          productType: order.productType,
          reviewer: user,
        },
        drizzle.db,
      );

      const response = await CourseReviewAPI.getCourseReviewsByCourseId(
        {
          host,
          headers: { LmsSecret },
        },
        product.courseId,
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

  describe('[Get course reviews]', () => {
    it('should be get many course reviews success', async () => {
      const SEED_REVIEW_COUNT = 3;
      const reviews = await seedCourseReviews(
        { count: SEED_REVIEW_COUNT },
        drizzle.db,
      );

      const response = await CourseReviewAPI.getCourseReviews(
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
    it('should be create course review success', async () => {
      const { order, product, userSession } = (
        await seedCourseOrders({ count: 1 }, drizzle.db)
      )[0];
      const reviewCreateParams: CreateReviewDto = {
        comment: 'Mock review comment',
        rating: 5,
      };

      const response = await CourseReviewAPI.createCourseReview(
        {
          host,
          headers: {
            LmsSecret,
            UserSessionId: userSession.id,
          },
        },
        product.courseId,
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
