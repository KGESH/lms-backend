import { INestApplication } from '@nestjs/common';
import { createTestingServer } from '../helpers/app.helper';
import { Uri } from '../../../src/shared/types/primitive';
import { DrizzleService } from '../../../src/infra/db/drizzle.service';
import * as MockEbookReviewAPI from '../../../src/api/functional/v1/review/admin/ebook';
import { ConfigsService } from '../../../src/configs/configs.service';
import { seedEbookProducts } from '../helpers/db/lms/ebook-product.helper';
import { seedUsers } from '../helpers/db/lms/user.helper';
import { CreateMockReviewDto } from '../../../src/v1/review/mock-review/mock-review.dto';
import { seedMockEbookReviews } from '../helpers/db/lms/review.helper';

describe('EbookReviewAdminController (e2e)', () => {
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

  describe('[Get mock ebook reviews]', () => {
    it('should be get empty mock ebook reviews success', async () => {
      const response = await MockEbookReviewAPI.getMockEbookReviews(
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

    it('should be get mock ebook reviews success', async () => {
      const [admin] = await seedUsers({ count: 1, role: 'admin' }, drizzle.db);
      const [{ ebook }] = await seedEbookProducts({ count: 1 }, drizzle.db);
      await seedMockEbookReviews(
        {
          ebookId: ebook.id,
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

      const response = await MockEbookReviewAPI.getMockEbookReviews(
        {
          host,
          headers: { LmsSecret },
        },
        {
          ebookId: ebook.id,
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
      expect(foundReviews[0].product.id).toEqual(ebook.id);
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
    it('should be create mock ebook review success', async () => {
      const [admin] = await seedUsers({ count: 1, role: 'admin' }, drizzle.db);
      const [{ ebook }] = await seedEbookProducts({ count: 1 }, drizzle.db);

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

      const response = await MockEbookReviewAPI.createMockEbookReview(
        {
          host,
          headers: {
            LmsSecret,
            UserSessionId: admin.userSession.id,
          },
        },
        ebook.id,
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
