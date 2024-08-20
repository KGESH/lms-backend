import { INestApplication } from '@nestjs/common';
import * as CategoryAPI from '../../../src/api/functional/v1/category';
import * as typia from 'typia';
import { createTestingServer } from '../helpers/app.helper';
import { Uri, Uuid } from '../../../src/shared/types/primitive';
import {
  CreateCategoryDto,
  UpdateCategoryDto,
} from '../../../src/v1/category/category.dto';
import {
  createCategory,
  createManyCategories,
  getRootCategoriesRawSql,
} from '../helpers/db/lms/category.helper';
import { DrizzleService } from '../../../src/infra/db/drizzle.service';

describe('CategoryController (e2e)', () => {
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

      const response = await CategoryAPI.getCategory({ host }, categoryId);
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
      const firstRootCategoryId: Uuid = typia.random<Uuid>();
      const firstRootLevelTwoCategoryId: Uuid = typia.random<Uuid>();
      const firstRootLevelThreeCategoryId: Uuid = typia.random<Uuid>();
      const secondRootCategoryId: Uuid = typia.random<Uuid>();
      const secondRootLevelTwoCategoryId: Uuid = typia.random<Uuid>();
      await createManyCategories(
        [
          {
            id: firstRootCategoryId,
            name: 'first root category',
            description: null,
            parentId: null,
          },
          {
            id: firstRootLevelTwoCategoryId,
            name: 'first level two category',
            description: null,
            parentId: firstRootCategoryId,
          },
          {
            id: firstRootLevelThreeCategoryId,
            name: 'first level three category',
            description: null,
            parentId: firstRootLevelTwoCategoryId,
          },
          {
            id: secondRootCategoryId,
            name: 'second root category',
            description: null,
            parentId: null,
          },
          {
            id: secondRootLevelTwoCategoryId,
            name: 'second level two category',
            description: null,
            parentId: secondRootCategoryId,
          },
        ],
        drizzle.db,
      );

      const categories = await getRootCategoriesRawSql(
        {
          page: 1,
          pageSize: 10,
          orderBy: 'asc',
        },
        drizzle.db,
      );

      expect(categories[0].depth).toEqual(1);
      expect(categories[0].children[0].depth).toEqual(2);

      //   const response = await CategoryAPI.getAllCategories({
      //     host,
      //   });
      //   if (!response.success) {
      //     throw new Error(`assert`);
      //   }
      //
      //   const rootCategories = response.data;
      //   const levelTwoCategory = rootCategories[0].children[0];
      //   const levelThreeCategory = levelTwoCategory.children[0];
      //
      //   expect(levelTwoCategory.name).toEqual('level two category');
      //   expect(levelThreeCategory.name).toEqual('level three category');
      // });
    });

    describe('[Create category]', () => {
      it('should be create category success', async () => {
        const createCategoryDto: CreateCategoryDto = {
          ...typia.random<CreateCategoryDto>(),
          parentId: null,
        };
        const response = await CategoryAPI.createCategory(
          { host },
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
          { host },
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
        const notFoundId = typia.random<Uuid>();
        const updateCategoryDto = typia.random<UpdateCategoryDto>();

        const notFoundResponse = await CategoryAPI.updateCategory(
          { host },
          notFoundId,
          updateCategoryDto,
        );

        expect(notFoundResponse.status).toEqual(404);
      });
    });

    describe('Delete category', () => {
      it('should be delete category success', async () => {
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
          { host },
          categoryId,
        );
        if (!deleteResponse.success) {
          throw new Error('assert');
        }

        const deletedCategory = deleteResponse.data;
        expect(deletedCategory.id).toEqual(categoryId);

        const getResponse = await CategoryAPI.getCategory({ host }, categoryId);
        if (!getResponse.success) {
          throw new Error('assert');
        }

        const foundCategory = getResponse.data;
        expect(foundCategory).toBe(null);
      });
    });
  });
});
