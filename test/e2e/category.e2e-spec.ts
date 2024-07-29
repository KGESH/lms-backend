import { INestApplication } from '@nestjs/common';
import * as CategoryApis from '../../nestia/api/functional/v1/category';
import * as typia from 'typia';
import { createTestingServer } from './app.helper';
import { Uri } from '../../src/shared/types/primitive';
import { ICategory } from '../../src/v1/category/category.interface';
import { CreateCategoryDto } from '../../src/v1/category/category.dto';

describe('UserController (e2e)', () => {
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
      const response = await CategoryApis.getAllCategories({
        host,
      });

      const categories = response.data;
      const isCategoryArray = typia.is<ICategory[]>(categories);
      expect(isCategoryArray).toBe(true);
    });
  });

  describe('[Create category]', () => {
    it('should be create category success', async () => {
      const createCategoryDto = typia.random<CreateCategoryDto>();

      const response = await CategoryApis.createCategory(
        { host },
        createCategoryDto,
      );

      const category = response.data;
      expect(category.name).toEqual(createCategoryDto.name);
    });
  });
});
