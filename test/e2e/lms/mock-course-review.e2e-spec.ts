import { INestApplication } from '@nestjs/common';
import { createTestingServer } from '../helpers/app.helper';
import { Uri } from '../../../src/shared/types/primitive';
import { DrizzleService } from '../../../src/infra/db/drizzle.service';
import * as MockCourseReviewAPI from '../../../src/api/functional/v1/review/admin/course';
import { ConfigsService } from '../../../src/configs/configs.service';
import { seedCourseProducts } from '../helpers/db/lms/course-product.helper';
import { seedUsers } from '../helpers/db/lms/user.helper';
import { CreateMockReviewDto } from '../../../src/v1/review/mock-review/mock-review.dto';
import { seedMockCourseReviews } from '../helpers/db/lms/review.helper';

describe('CourseReviewAdminController (e2e)', () => {
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

  describe('[Get mock course reviews]', () => {
    it('should be get empty mock course reviews success', async () => {
      const response = await MockCourseReviewAPI.getMockCourseReviews(
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

      const foundEmptyReviews = response.data;
      expect(foundEmptyReviews).toEqual([]);
    });

    it('should be get mock course reviews success', async () => {
      const [admin] = await seedUsers({ count: 1, role: 'admin' }, drizzle.db);
      const [{ course }] = await seedCourseProducts({ count: 1 }, drizzle.db);
      await seedMockCourseReviews(
        {
          courseId: course.id,
          adminUser: admin.user,
          mockReviewUsers: [
            {
              displayName: 'Mock user 1',
              email: 'mock@gmail.com',
              image: 'https://mock-thumbnail.com',
            },
            {
              displayName: 'Mock user 2',
              email: 'mock2@gmail.com',
              image: null,
            },
          ],
        },
        drizzle.db,
      );

      const response = await MockCourseReviewAPI.getMockCourseReviews(
        {
          host,
          headers: { LmsSecret },
        },
        {
          courseId: course.id,
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
      expect(foundReviews[0].product.id).toEqual(course.id);
      expect(
        foundReviews.find(
          (foundReview) => foundReview.user.displayName === 'Mock user 1',
        ),
      ).toBeDefined();
      expect(
        foundReviews.find(
          (foundReview) => foundReview.user.email === 'mock2@gmail.com',
        ),
      ).toBeDefined();
    });
  });

  describe('[Create mock review]', () => {
    it('should be create mock course review success', async () => {
      const [admin] = await seedUsers({ count: 1, role: 'admin' }, drizzle.db);
      const [{ course }] = await seedCourseProducts({ count: 1 }, drizzle.db);

      const createMockReviewDto: CreateMockReviewDto = {
        mockReviewCreateParams: {
          comment: 'Mock review comment',
          rating: 5,
        },
        mockUserCreateParams: {
          displayName: 'mock user',
          email: 'mock@mock.com',
          image: 'https://mock-thumbnail.com',
        },
      };

      const response = await MockCourseReviewAPI.createMockCourseReview(
        {
          host,
          headers: {
            LmsSecret,
            UserSessionId: admin.userSession.id,
          },
        },
        course.id,
        createMockReviewDto,
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
