import { INestApplication } from '@nestjs/common';
import * as CategoryAPI from '../../../src/api/functional/v1/category';
import * as typia from 'typia';
import { createTestingServer } from '../helpers/app.helper';
import { Uri, Uuid } from '../../../src/shared/types/primitive';
import { ICategory } from '../../../src/v1/category/category.interface';
import {
  CreateCategoryDto,
  UpdateCategoryDto,
} from '../../../src/v1/category/category.dto';
import { HttpError } from '@nestia/fetcher';
import { IErrorResponse } from '../../../src/shared/types/response';
import { convertException } from '../../../src/shared/helpers/nestia/convert-exception';

describe('CategoryController (e2e)', () => {
  let host: Uri;
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestingServer();
    host = await app.getUrl();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('[Get categories]', () => {
    it('should be get all categories', async () => {
      const response = await CategoryAPI.getAllCategories({
        host,
      });
      if (!response.success) {
        throw new Error('assert');
      }

      const categories = response.data;
      const isCategoryArray = typia.is<ICategory[]>(categories);
      expect(isCategoryArray).toBe(true);
    });
  });

  describe('[Create category]', () => {
    it('should be create category success', async () => {
      const createCategoryDto = typia.random<CreateCategoryDto>();
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
      const createCategoryDto = typia.random<CreateCategoryDto>();
      const createResponse = await CategoryAPI.createCategory(
        { host },
        createCategoryDto,
      );
      if (!createResponse.success) {
        throw new Error('assert');
      }

      const category = createResponse.data;
      const updateCategoryDto: UpdateCategoryDto = {
        ...createCategoryDto,
        name: `Updated ${createCategoryDto.name}`,
      };

      const updateResponse = await CategoryAPI.updateCategory(
        { host },
        category.id,
        updateCategoryDto,
      );
      if (!updateResponse.success) {
        throw new Error('assert');
      }

      const updatedCategory = updateResponse.data;
      expect(updatedCategory.name).toEqual(updateCategoryDto.name);
      expect(updatedCategory.id).toEqual(category.id);
    });

    it('should be update category fail', async () => {
      const notFoundId = typia.random<Uuid>();
      const updateCategoryDto = typia.random<UpdateCategoryDto>();

      try {
        await CategoryAPI.updateCategory(
          { host },
          notFoundId,
          updateCategoryDto,
        );
      } catch (e) {
        const notFoundErrorResponse = convertException<IErrorResponse>(
          e as HttpError,
        );
        expect(notFoundErrorResponse.statusCode).toEqual(777);
      }
    });
  });

  describe('Delete category', () => {
    it('should be delete category success', async () => {
      const createCategoryDto = typia.random<CreateCategoryDto>();
      const createResponse = await CategoryAPI.createCategory(
        { host },
        createCategoryDto,
      );
      if (!createResponse.success) {
        throw new Error('assert');
      }

      const category = createResponse.data;
      const deleteResponse = await CategoryAPI.deleteCategory(
        { host },
        category.id,
      );
      if (!deleteResponse.success) {
        throw new Error('assert');
      }

      const deletedCategory = deleteResponse.data;
      expect(deletedCategory.id).toEqual(category.id);

      const getResponse = await CategoryAPI.getCategory({ host }, category.id);
      if (!getResponse.success) {
        throw new Error('assert');
      }

      const foundCategory = getResponse.data;
      expect(foundCategory).toBe(null);
    });
  });
});
