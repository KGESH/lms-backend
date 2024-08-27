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
import { CreateCourseReviewDto } from '../../../src/v1/review/course-review/course-review.dto';
import { ConfigsService } from '../../../src/configs/configs.service';

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
      const { order, product } = (
        await seedCourseOrders({ count: 1 }, drizzle.db)
      )[0];
      const review = await createRandomCourseReview(
        {
          courseId: product.courseId,
          orderId: order.id,
          productType: order.productType,
          userId: order.userId,
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
      console.log('foundReviews', foundReviews);
      expect(
        foundReviews.find((foundReview) => foundReview.id === review.id),
      ).toBeDefined();
    });
  });

  describe('[Get course reviews]', () => {
    it('should be get many course reviews success', async () => {
      const reviews = await seedCourseReviews({ count: 3 }, drizzle.db);

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
    });
  });

  describe('[Create review]', () => {
    it('should be create course review success', async () => {
      const { order, product, userSession } = (
        await seedCourseOrders({ count: 1 }, drizzle.db)
      )[0];
      const reviewCreateParams: CreateCourseReviewDto = {
        comment: 'Mock review comment',
        userId: order.userId,
        orderId: order.id,
        courseId: product.courseId,
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
