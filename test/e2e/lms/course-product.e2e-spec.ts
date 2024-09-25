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
import { createUuid } from '@src/shared/utils/uuid';

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
        description: null,
        pricing: {
          amount: '100000',
        },
        announcement: {
          richTextContent: '테스트 공지사항',
        },
        refundPolicy: {
          richTextContent: '테스트 환불정책',
        },
        uiContents: [
          {
            type: 'main_banner',
            content: '테스트 비디오 배너',
            metadata: null,
            description: 'mock main banner',
            sequence: 1,
            url: 'https://www.youtube.com',
          },
          {
            type: 'target_description',
            content: '테스트 타겟 말풍선',
            metadata: null,
            description: null,
            sequence: 1,
            url: null,
          },
          {
            type: 'tag',
            content: '테스트 구매 대상 태그',
            metadata: null,
            description: null,
            sequence: 1,
            url: null,
          },
          {
            type: 'badge',
            content: '테스트 뱃지 UI',
            metadata: null,
            description: null,
            sequence: 1,
            url: null,
          },
        ],
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
      expect(product.description).toEqual(null);
      expect(product.courseId).toEqual(course.id);
      expect(product.pricing.amount).toEqual('100000');
      expect(product.announcement.richTextContent).toEqual('테스트 공지사항');
      expect(product.refundPolicy.richTextContent).toEqual('테스트 환불정책');
      expect(
        product.uiContents.find((ui) => ui.type === 'main_banner')!.url,
      ).toEqual('https://www.youtube.com');
      expect(
        product.uiContents.find((ui) => ui.type === 'target_description')!
          .content,
      ).toEqual('테스트 타겟 말풍선');
      expect(
        product.uiContents.find((ui) => ui.type === 'tag')!.content,
      ).toEqual('테스트 구매 대상 태그');
      expect(
        product.uiContents.find((ui) => ui.type === 'badge')!.content,
      ).toEqual('테스트 뱃지 UI');
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
        snapshot: {
          title: 'updated product title',
          description: 'updated description',
        },
        thumbnail: {
          id: createUuid(), // Uploaded file ID
          metadata: null,
          type: 'image',
          url: 'https://aceternity.com/images/products/thumbnails/new/editrix.png',
        },
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
        discount: {
          discountType: 'percent',
          enabled: true,
          validFrom: date.now('iso'),
          validTo: date.now('iso'),
          value: '33.33',
        },
        uiContents: {
          create: [
            {
              type: 'target_description',
              content: 'mock new content',
              description: null,
              metadata: null,
              sequence: 1,
              url: null,
            },
          ],
          update: lastSnapshot?.uiContents[0]
            ? [
                {
                  id: lastSnapshot.uiContents[0].id,
                  content: 'updated first content',
                },
              ]
            : [],
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
      expect(updated.discount.value).toEqual('33.33');
      expect(
        updated.uiContents.find((ui) => ui.content === 'mock new content'),
      ).toBeDefined();
    });
  });
});
