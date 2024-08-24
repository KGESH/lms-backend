import * as typia from 'typia';
import * as EbookCategoryAPI from '../../../src/api/functional/v1/ebook/category';
import { Uri, Uuid } from '@src/shared/types/primitive';
import { INestApplication } from '@nestjs/common';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import { ConfigsService } from '@src/configs/configs.service';
import { createTestingServer } from '../helpers/app.helper';
import {
  createEbookCategory,
  seedEbookCategoriesWithChildren,
} from '../helpers/db/lms/ebook-category.helper';
import { seedUsers } from '../helpers/db/lms/user.helper';
import {
  CreateEbookCategoryDto,
  UpdateEbookCategoryDto,
} from '@src/v1/ebook/category/ebook-category.dto';

describe('EbookCategoryController (e2e)', () => {
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
      await createEbookCategory(
        {
          id: categoryId,
          name: 'category',
          description: 'GET category test',
          parentId: null,
        },
        drizzle.db,
      );

      const response = await EbookCategoryAPI.getEbookCategory(
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
        await seedEbookCategoriesWithChildren({ count: 2 }, drizzle.db);

      const response = await EbookCategoryAPI.getRootEbookCategories(
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

      const createEbookCategoryDto: CreateEbookCategoryDto = {
        ...typia.random<CreateEbookCategoryDto>(),
        parentId: null,
      };

      const response = await EbookCategoryAPI.createEbookCategory(
        {
          host,
          headers: {
            LmsSecret,
            UserSessionId: admin.userSession.id,
          },
        },
        createEbookCategoryDto,
      );
      if (!response.success) {
        throw new Error('assert');
      }

      const category = response.data;
      expect(category.name).toEqual(createEbookCategoryDto.name);
    });
  });

  describe('Update category', () => {
    it('should be update category success', async () => {
      const admin = (
        await seedUsers({ count: 1, role: 'admin' }, drizzle.db)
      )[0];

      const categoryId: Uuid = typia.random<Uuid>();
      await createEbookCategory(
        {
          id: categoryId,
          name: 'category',
          description: 'GET category test',
          parentId: null,
        },
        drizzle.db,
      );
      const updateEbookCategoryDto: UpdateEbookCategoryDto = {
        name: 'updated',
      };

      const updateResponse = await EbookCategoryAPI.updateEbookCategory(
        {
          host,
          headers: {
            LmsSecret,
            UserSessionId: admin.userSession.id,
          },
        },
        categoryId,
        updateEbookCategoryDto,
      );
      if (!updateResponse.success) {
        throw new Error('assert');
      }

      const updatedEbookCategory = updateResponse.data;
      expect(updatedEbookCategory.name).toEqual('updated');
    });

    it('should be update category fail', async () => {
      const admin = (
        await seedUsers({ count: 1, role: 'admin' }, drizzle.db)
      )[0];

      const notFoundId = typia.random<Uuid>();
      const updateEbookCategoryDto = typia.random<UpdateEbookCategoryDto>();

      const notFoundResponse = await EbookCategoryAPI.updateEbookCategory(
        {
          host,
          headers: {
            LmsSecret,
            UserSessionId: admin.userSession.id,
          },
        },
        notFoundId,
        updateEbookCategoryDto,
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
      await createEbookCategory(
        {
          id: categoryId,
          name: 'category',
          description: 'GET category test',
          parentId: null,
        },
        drizzle.db,
      );

      const deleteResponse = await EbookCategoryAPI.deleteEbookCategory(
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

      const deletedEbookCategory = deleteResponse.data;
      expect(deletedEbookCategory.id).toEqual(categoryId);

      const getResponse = await EbookCategoryAPI.getEbookCategory(
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

      const foundEbookCategory = getResponse.data;
      expect(foundEbookCategory).toBe(null);
    });
  });
});
