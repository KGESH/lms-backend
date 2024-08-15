import { INestApplication } from '@nestjs/common';
import * as CourseOrderAPI from '../../../src/api/functional/v1/order/course';
import * as typia from 'typia';
import { createTestingServer } from '../helpers/app.helper';
import { Price, Uri } from '../../../src/shared/types/primitive';
import { DrizzleService } from '../../../src/infra/db/drizzle.service';
import { createRandomCourseProduct } from '../helpers/db/lms/course-product.helper';
import { seedUsers } from '../helpers/db/lms/user.helper';

describe('CourseOrderController (e2e)', () => {
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

  describe('[Create course order]', () => {
    it('should be purchase a course order success', async () => {
      const { user } = (await seedUsers({ count: 1 }, drizzle.db))[0];
      const courseProduct = await createRandomCourseProduct(drizzle.db);

      const response = await CourseOrderAPI.purchaseCourseProduct(
        { host },
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

      const foundCourseOrder = response.data;
      expect(foundCourseOrder).not.toBeNull();
      expect(foundCourseOrder.paymentMethod).toEqual('신용카드');
    });
  });
});
