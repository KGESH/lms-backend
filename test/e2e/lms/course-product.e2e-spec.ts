import { INestApplication } from '@nestjs/common';
import * as CourseProductAPI from '../../../src/api/functional/v1/product/course';
import * as typia from 'typia';
import { createTestingServer } from '../helpers/app.helper';
import { Uri } from '@src/shared/types/primitive';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import { createRandomCourseProduct } from '../helpers/db/lms/course-product.helper';
import { CreateCourseProductDto } from '@src/v1/product/course-product/course-product.dto';
import { createRandomCourse } from '../helpers/db/lms/course.helper';
import { ConfigsService } from '@src/configs/configs.service';

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
        throw new Error('assert');
      }

      const foundCourseProduct = response.data;
      expect(foundCourseProduct).not.toBeNull();
      expect(foundCourseProduct!.title).toEqual(product.lastSnapshot?.title);
    });
  });

  describe('[Create course product]', () => {
    it('should be create course product success', async () => {
      const { course, userSession } = await createRandomCourse(drizzle.db);
      const createDto: CreateCourseProductDto = {
        ...typia.random<CreateCourseProductDto>(),
        title: 'mock-product',
      };

      const response = await CourseProductAPI.createProductCourse(
        {
          host,
          headers: {
            LmsSecret,
            UserSessionId: userSession.id,
          },
        },
        course.id,
        createDto,
      );
      if (!response.success) {
        throw new Error('assert');
      }

      const product = response.data;

      expect(product.title).toEqual('mock-product');
      expect(product.courseId).toEqual(course.id);
    });
  });
});
