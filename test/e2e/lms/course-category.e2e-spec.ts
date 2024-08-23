import { INestApplication } from '@nestjs/common';
import * as CourseCategoryAPI from '../../../src/api/functional/v1/course/category';
import * as typia from 'typia';
import { createTestingServer } from '../helpers/app.helper';
import { Uri, Uuid } from '@src/shared/types/primitive';
import {
  CreateCourseCategoryDto,
  UpdateCourseCategoryDto,
} from '@src/v1/course/category/course-category.dto';
import {
  createCourseCategory,
  seedCourseCategoriesWithChildren,
} from '../helpers/db/lms/course-category.helper';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import { ConfigsService } from '@src/configs/configs.service';
import { seedUsers } from '../helpers/db/lms/user.helper';

describe('CourseCategoryController (e2e)', () => {
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

  describe('[Get category]', () => {
    it('should be get a category', async () => {
      const categoryId: Uuid = typia.random<Uuid>();
      await createCourseCategory(
        {
          id: categoryId,
          name: 'category',
          description: 'GET category test',
          parentId: null,
        },
        drizzle.db,
      );

      const response = await CourseCategoryAPI.getCourseCategory(
        {
          host,
          headers: { LmsSecret },
        },
        categoryId,
        { withChildren: false },
      );
      if (!response.success) {
        throw new Error('assert');
      }

      const category = response.data;

      expect(category).not.toBeNull();
      expect(category!.id).toEqual(categoryId);
    });
  });

  describe('[Get categories]', () => {
    it('should be get all categories', async () => {
      const { rootCategories, levelTwoCategories, levelThreeCategories } =
        await seedCourseCategoriesWithChildren({ count: 2 }, drizzle.db);

      const response = await CourseCategoryAPI.getRootCourseCategories(
        {
          host,
          headers: { LmsSecret },
        },
        { withChildren: true },
      );

      if (!response.success) {
        throw new Error(`assert`);
      }

      const roots = response.data;

      expect(
        roots[0].children.find(
          (category) => category.id === levelTwoCategories[0].id,
        ),
      ).not.toBeNull();
    });
  });

  describe('[Create category]', () => {
    it('should be create category success', async () => {
      const admin = (
        await seedUsers({ count: 1, role: 'admin' }, drizzle.db)
      )[0];

      const createCourseCategoryDto: CreateCourseCategoryDto = {
        ...typia.random<CreateCourseCategoryDto>(),
        parentId: null,
      };

      const response = await CourseCategoryAPI.createCourseCategory(
        {
          host,
          headers: {
            LmsSecret,
            UserSessionId: admin.userSession.id,
          },
        },
        createCourseCategoryDto,
      );
      if (!response.success) {
        throw new Error('assert');
      }

      const category = response.data;
      expect(category.name).toEqual(createCourseCategoryDto.name);
    });
  });

  describe('Update category', () => {
    it('should be update category success', async () => {
      const admin = (
        await seedUsers({ count: 1, role: 'admin' }, drizzle.db)
      )[0];

      const categoryId: Uuid = typia.random<Uuid>();
      await createCourseCategory(
        {
          id: categoryId,
          name: 'category',
          description: 'GET category test',
          parentId: null,
        },
        drizzle.db,
      );
      const updateCourseCategoryDto: UpdateCourseCategoryDto = {
        name: 'updated',
      };

      const updateResponse = await CourseCategoryAPI.updateCourseCategory(
        {
          host,
          headers: {
            LmsSecret,
            UserSessionId: admin.userSession.id,
          },
        },
        categoryId,
        updateCourseCategoryDto,
      );
      if (!updateResponse.success) {
        throw new Error('assert');
      }

      const updatedCourseCategory = updateResponse.data;
      expect(updatedCourseCategory.name).toEqual('updated');
    });

    it('should be update category fail', async () => {
      const admin = (
        await seedUsers({ count: 1, role: 'admin' }, drizzle.db)
      )[0];

      const notFoundId = typia.random<Uuid>();
      const updateCourseCategoryDto = typia.random<UpdateCourseCategoryDto>();

      const notFoundResponse = await CourseCategoryAPI.updateCourseCategory(
        {
          host,
          headers: {
            LmsSecret,
            UserSessionId: admin.userSession.id,
          },
        },
        notFoundId,
        updateCourseCategoryDto,
      );

      expect(notFoundResponse.status).toEqual(404);
    });
  });

  describe('Delete category', () => {
    it('should be delete category success', async () => {
      const admin = (
        await seedUsers({ count: 1, role: 'admin' }, drizzle.db)
      )[0];

      const categoryId: Uuid = typia.random<Uuid>();
      await createCourseCategory(
        {
          id: categoryId,
          name: 'category',
          description: 'GET category test',
          parentId: null,
        },
        drizzle.db,
      );

      const deleteResponse = await CourseCategoryAPI.deleteCourseCategory(
        {
          host,
          headers: {
            LmsSecret,
            UserSessionId: admin.userSession.id,
          },
        },
        categoryId,
      );
      if (!deleteResponse.success) {
        throw new Error('assert');
      }

      const deletedCourseCategory = deleteResponse.data;
      expect(deletedCourseCategory.id).toEqual(categoryId);

      const getResponse = await CourseCategoryAPI.getCourseCategory(
        {
          host,
          headers: { LmsSecret },
        },
        categoryId,
        { withChildren: false },
      );
      if (!getResponse.success) {
        throw new Error('assert');
      }

      const foundCourseCategory = getResponse.data;
      expect(foundCourseCategory).toBe(null);
    });
  });
});
