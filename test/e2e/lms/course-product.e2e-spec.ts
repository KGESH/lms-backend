import { INestApplication } from '@nestjs/common';
import * as CourseProductAPI from '../../../src/api/functional/v1/product/course';
import * as typia from 'typia';
import { createTestingServer } from '../helpers/app.helper';
import { Uri } from '../../../src/shared/types/primitive';
import { DrizzleService } from '../../../src/infra/db/drizzle.service';
import { createRandomCourseProduct } from '../helpers/db/lms/course-product.helper';
import { CourseProductCreateDto } from '../../../src/v1/product/course-product/course-product.dto';
import { createRandomCourse } from '../helpers/db/lms/course.helper';

describe('CourseProductController (e2e)', () => {
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

  describe('[Get course product]', () => {
    it('should be get a course product success', async () => {
      const product = await createRandomCourseProduct(drizzle);

      const response = await CourseProductAPI.getCourseProduct(
        { host },
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
      const { course } = await createRandomCourse(drizzle);
      const createDto: CourseProductCreateDto = {
        ...typia.random<CourseProductCreateDto>(),
        title: 'mock-product',
      };

      const response = await CourseProductAPI.createProductCourse(
        { host },
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
