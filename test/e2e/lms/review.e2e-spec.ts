import { INestApplication } from '@nestjs/common';
import { createTestingServer } from '../helpers/app.helper';
import { Uri } from '../../../src/shared/types/primitive';
import { DrizzleService } from '../../../src/infra/db/drizzle.service';
import {
  createRandomCourseReview,
  seedCourseReviews,
} from '../helpers/db/lms/review.helper';
import { seedCourseOrders } from '../helpers/db/lms/order.helper';
import * as ReviewAPI from '../../../src/api/functional/v1/review';
import * as CourseReviewAPI from '../../../src/api/functional/v1/review/course';
import * as typia from 'typia';
import { CreateCourseReviewDto } from '../../../src/v1/review/course-review/course-review.dto';

describe('ReviewController (e2e)', () => {
  let host: Uri;
  let app: INestApplication;
  let drizzle: DrizzleService;

  beforeEach(async () => {
    app = await createTestingServer();
    host = await app.getUrl();
    drizzle = await app.get(DrizzleService);
  });

  afterEach(async () => {
    await app.close();
  });

  describe('[Get review]', () => {
    it('should be get review success', async () => {
      const { order } = (await seedCourseOrders({ count: 1 }, drizzle.db))[0];
      const reviewWithSnapshot = await createRandomCourseReview(
        {
          orderId: order.id,
          productType: order.productType,
          userId: order.userId,
        },
        drizzle.db,
      );

      const response = await ReviewAPI.getReview(
        { host },
        reviewWithSnapshot.id,
      );
      if (!response.success) {
        const message = JSON.stringify(response.data, null, 4);
        throw new Error(`[assert] ${message}`);
      }

      const foundReview = response.data;
      expect(foundReview!.orderId).toEqual(order.id);
    });
  });

  describe('[Get reviews]', () => {
    it('should be get many reviews success', async () => {
      const reviews = await seedCourseReviews({ count: 3 }, drizzle.db);

      const response = await ReviewAPI.getReviews(
        { host },
        {
          productType: 'course',
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
      const { order, product } = (
        await seedCourseOrders({ count: 1 }, drizzle.db)
      )[0];
      const reviewCreateParams: CreateCourseReviewDto = {
        ...typia.random<CreateCourseReviewDto>(),
        userId: order.userId,
        orderId: order.id,
        courseId: product.courseId,
        rating: 5,
      };

      const response = await CourseReviewAPI.createCourseReview(
        { host },
        reviewCreateParams,
      );
      if (!response.success) {
        const message = JSON.stringify(response.data, null, 5);
        throw new Error(`[assert] ${message}`);
      }

      const createdReview = response.data;
      expect(createdReview.snapshot.rating).toEqual(5);
    });
  });
});
