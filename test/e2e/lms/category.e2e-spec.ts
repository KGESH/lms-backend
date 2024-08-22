import { INestApplication } from '@nestjs/common';
import * as CategoryAPI from '../../../src/api/functional/v1/category';
import * as typia from 'typia';
import { createTestingServer } from '../helpers/app.helper';
import { Uri, Uuid } from '@src/shared/types/primitive';
import {
  CreateCategoryDto,
  UpdateCategoryDto,
} from '@src/v1/category/category.dto';
import {
  createCategory,
  seedCategoriesWithChildren,
} from '../helpers/db/lms/category.helper';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import { ConfigsService } from '@src/configs/configs.service';
import { seedUsers } from '../helpers/db/lms/user.helper';

describe('CategoryController (e2e)', () => {
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
      await createCategory(
        {
          id: categoryId,
          name: 'category',
          description: 'GET category test',
          parentId: null,
        },
        drizzle.db,
      );

      const response = await CategoryAPI.getCategory(
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
        await seedCategoriesWithChildren({ count: 2 }, drizzle.db);

      const response = await CategoryAPI.getRootCategories(
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

      const createCategoryDto: CreateCategoryDto = {
        ...typia.random<CreateCategoryDto>(),
        parentId: null,
      };

      const response = await CategoryAPI.createCategory(
        {
          host,
          headers: {
            LmsSecret,
            UserSessionId: admin.userSession.id,
          },
        },
        createCategoryDto,
      );
      if (!response.success) {
        throw new Error('assert');
      }

      const category = response.data;
      expect(category.name).toEqual(createCategoryDto.name);
    });
  });

  describe('Update category', () => {
    it('should be update category success', async () => {
      const admin = (
        await seedUsers({ count: 1, role: 'admin' }, drizzle.db)
      )[0];

      const categoryId: Uuid = typia.random<Uuid>();
      await createCategory(
        {
          id: categoryId,
          name: 'category',
          description: 'GET category test',
          parentId: null,
        },
        drizzle.db,
      );
      const updateCategoryDto: UpdateCategoryDto = { name: 'updated' };

      const updateResponse = await CategoryAPI.updateCategory(
        {
          host,
          headers: {
            LmsSecret,
            UserSessionId: admin.userSession.id,
          },
        },
        categoryId,
        updateCategoryDto,
      );
      if (!updateResponse.success) {
        throw new Error('assert');
      }

      const updatedCategory = updateResponse.data;
      expect(updatedCategory.name).toEqual('updated');
    });

    it('should be update category fail', async () => {
      const admin = (
        await seedUsers({ count: 1, role: 'admin' }, drizzle.db)
      )[0];

      const notFoundId = typia.random<Uuid>();
      const updateCategoryDto = typia.random<UpdateCategoryDto>();

      const notFoundResponse = await CategoryAPI.updateCategory(
        {
          host,
          headers: {
            LmsSecret,
            UserSessionId: admin.userSession.id,
          },
        },
        notFoundId,
        updateCategoryDto,
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
      await createCategory(
        {
          id: categoryId,
          name: 'category',
          description: 'GET category test',
          parentId: null,
        },
        drizzle.db,
      );

      const deleteResponse = await CategoryAPI.deleteCategory(
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

      const deletedCategory = deleteResponse.data;
      expect(deletedCategory.id).toEqual(categoryId);

      const getResponse = await CategoryAPI.getCategory(
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

      const foundCategory = getResponse.data;
      expect(foundCategory).toBe(null);
    });
  });
});
