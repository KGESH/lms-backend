import { INestApplication } from '@nestjs/common';
import * as CourseProductAPI from '../../../src/api/functional/v1/product/course';
import * as typia from 'typia';
import * as date from '../../../src/shared/utils/date';
import { createTestingServer } from '../helpers/app.helper';
import { Uri } from '@src/shared/types/primitive';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import {
  createRandomCourseProduct,
  seedCourseProducts,
} from '../helpers/db/lms/course-product.helper';
import {
  CreateCourseProductDto,
  UpdateCourseProductDto,
} from '@src/v1/product/course-product/course-product.dto';
import { createRandomCourse } from '../helpers/db/lms/course.helper';
import { ConfigsService } from '@src/configs/configs.service';
import { seedUsers } from '../helpers/db/lms/user.helper';

describe('CourseProductController (e2e)', () => {
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

  describe('[Get course products]', () => {
    it('should be get many course products success', async () => {
      const SEED_PRODUCT_COUNT = 10;
      await seedCourseProducts({ count: SEED_PRODUCT_COUNT }, drizzle.db);

      const response = await CourseProductAPI.getCourseProducts(
        {
          host,
          headers: { LmsSecret },
        },
        {
          page: 1,
          pageSize: 5,
          orderBy: 'asc',
        },
      );
      if (!response.success) {
        const message = JSON.stringify(response.data, null, 4);
        throw new Error(`assert - ${message}`);
      }

      const { data: fetchedProducts, pagination, totalCount } = response.data;

      expect(fetchedProducts.length).toEqual(5);
      expect(pagination.pageSize).toEqual(5);
      expect(pagination.page).toEqual(1);
      expect(totalCount).toEqual(SEED_PRODUCT_COUNT);
    });
  });

  describe('[Get course product]', () => {
    it('should be get a course product success', async () => {
      const product = await createRandomCourseProduct(drizzle.db);

      const response = await CourseProductAPI.getCourseProduct(
        {
          host,
          headers: { LmsSecret },
        },
        product.courseId,
      );
      if (!response.success) {
        const message = JSON.stringify(response.data, null, 4);
        throw new Error(`assert - ${message}`);
      }

      const foundCourseProduct = response.data;
      expect(foundCourseProduct).not.toBeNull();
      expect(foundCourseProduct!.title).toEqual(product.lastSnapshot?.title);
    });
  });

  describe('[Create course product]', () => {
    it('should be create course product success', async () => {
      const { course } = await createRandomCourse(drizzle.db);
      const createDto: CreateCourseProductDto = {
        ...typia.random<CreateCourseProductDto>(),
        title: 'mock-product',
      };

      const admin = (
        await seedUsers({ count: 1, role: 'admin' }, drizzle.db)
      )[0];

      const response = await CourseProductAPI.createProductCourse(
        {
          host,
          headers: {
            LmsSecret,
            UserSessionId: admin.userSession.id,
          },
        },
        course.id,
        createDto,
      );
      if (!response.success) {
        const message = JSON.stringify(response.data, null, 4);
        throw new Error(`assert - ${message}`);
      }

      const product = response.data;

      expect(product.title).toEqual('mock-product');
      expect(product.courseId).toEqual(course.id);
    });
  });

  describe('[Update course product]', () => {
    it('should be update course product success', async () => {
      const { courseId, lastSnapshot } = (
        await seedCourseProducts({ count: 1 }, drizzle.db)
      )[0];

      const admin = (
        await seedUsers({ count: 1, role: 'admin' }, drizzle.db)
      )[0];

      const updateDto: UpdateCourseProductDto = {
        title: 'updated product title',
        description: 'updated description',
        pricing: {
          amount: '10000',
        },
        announcement: {
          richTextContent: 'updated announcement',
        },
        content: {
          richTextContent: 'updated content',
        },
        refundPolicy: {
          richTextContent: 'updated refund policy',
        },
        discounts: {
          discountType: 'percent',
          validFrom: date.now('iso'),
          validTo: date.now('iso'),
          value: '33.33',
        },
      };

      const response = await CourseProductAPI.updateProductCourse(
        {
          host,
          headers: {
            LmsSecret,
            UserSessionId: admin.userSession.id,
          },
        },
        courseId,
        updateDto,
      );
      if (!response.success) {
        const message = JSON.stringify(response.data, null, 4);
        throw new Error(`assert - ${message}`);
      }

      const updated = response.data;

      expect(updated.title).toEqual('updated product title');
      expect(updated.description).toEqual('updated description');
      expect(updated.pricing.amount).toEqual('10000');
      expect(updated.announcement.richTextContent).toEqual(
        'updated announcement',
      );
      expect(updated.content.richTextContent).toEqual('updated content');
      expect(updated.refundPolicy.richTextContent).toEqual(
        'updated refund policy',
      );
      expect(updated.discounts!.value).toEqual('33.33');
    });
  });
});
