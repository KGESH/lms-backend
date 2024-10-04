import { INestApplication } from '@nestjs/common';
import { createTestingServer } from '../helpers/app.helper';
import { Uri } from '../../../src/shared/types/primitive';
import { DrizzleService } from '../../../src/infra/db/drizzle.service';
import {
  seedCourseReviews,
  seedEbookReviews,
} from '../helpers/db/lms/review.helper';
import { ConfigsService } from '../../../src/configs/configs.service';
import * as ReviewAPI from '../../../src/api/functional/v1/review';

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

  describe('[Get course and ebook reviews]', () => {
    it('should be get many course reviews success', async () => {
      const SEED_REVIEW_COUNT = 5;

      const ebookReviews = await seedEbookReviews(
        { count: SEED_REVIEW_COUNT },
        drizzle.db,
      );

      const courseReviews = await seedCourseReviews(
        { count: SEED_REVIEW_COUNT },
        drizzle.db,
      );

      const response = await ReviewAPI.getEveryReviews(
        {
          host,
          headers: { LmsSecret },
        },
        {
          page: 1,
          pageSize: 6,
          orderBy: 'asc',
        },
      );
      if (!response.success) {
        const message = JSON.stringify(response.data, null, 4);
        throw new Error(`[assert] ${message}`);
      }

      const { totalCount, pagination, data } = response.data;

      expect(totalCount).toBe(SEED_REVIEW_COUNT * 2);
      expect(pagination.page).toBe(1);
      expect(pagination.pageSize).toBe(6);
      // first element is 'ebook' review. [order by asc]
      expect(data.at(0)!.productType).toBe('ebook');
      // last element is 'course' review. [order by asc]
      expect(data.at(-1)!.productType).toBe('course');
    });
  });
});
