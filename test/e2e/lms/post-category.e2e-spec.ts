import * as typia from 'typia';
import * as PostCategoryAPI from '../../../src/api/functional/v1/post_category';
import { Uri, Uuid } from '@src/shared/types/primitive';
import { INestApplication } from '@nestjs/common';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import { ConfigsService } from '@src/configs/configs.service';
import { createTestingServer } from '../helpers/app.helper';
import {
  createPostCategory,
  seedPostCategoriesWithChildren,
} from '../helpers/db/lms/post-category.helper';
import { seedUsers } from '../helpers/db/lms/user.helper';
import {
  CreatePostCategoryDto,
  UpdatePostCategoryDto,
} from '@src/v1/post/category/post-category.dto';

describe('PostCategoryController (e2e)', () => {
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

  describe('[Get post category]', () => {
    it('should be get a post category', async () => {
      const categoryId: Uuid = typia.random<Uuid>();
      await createPostCategory(
        {
          id: categoryId,
          name: 'post category',
          description: 'GET post category test',
          parentId: null,
        },
        {
          readableRoles: ['guest'],
          writableRoles: ['user', 'teacher', 'manager', 'admin'],
        },
        drizzle.db,
      );

      const response = await PostCategoryAPI.getPostCategory(
        {
          host,
          headers: { LmsSecret },
        },
        categoryId,
        { withChildren: false },
      );
      if (!response.success) {
        const message = JSON.stringify(response.data, null, 4);
        throw new Error(`assert - ${message}`);
      }

      const category = response.data;

      expect(category).not.toBeNull();
      expect(category!.id).toEqual(categoryId);
    });
  });

  describe('[Get categories]', () => {
    it('should be get all categories', async () => {
      const { rootCategories, levelTwoCategories, levelThreeCategories } =
        await seedPostCategoriesWithChildren({ count: 2 }, drizzle.db);

      const response = await PostCategoryAPI.getRootPostCategories(
        {
          host,
          headers: { LmsSecret },
        },
        { withChildren: true },
      );

      if (!response.success) {
        const message = JSON.stringify(response.data, null, 4);
        throw new Error(`assert - ${message}`);
      }

      const roots = response.data;

      expect(
        roots[0].children.find(
          (category) => category.id === levelTwoCategories[0].id,
        ),
      ).not.toBeNull();
    });
  });

  describe('[Create post category]', () => {
    it('should be create post category success', async () => {
      const admin = (
        await seedUsers({ count: 1, role: 'admin' }, drizzle.db)
      )[0];

      const createPostCategoryDto: CreatePostCategoryDto = {
        name: 'new post category',
        description: 'POST category test',
        parentId: null,
      };

      const response = await PostCategoryAPI.createPostCategory(
        {
          host,
          headers: {
            LmsSecret,
            UserSessionId: admin.userSession.id,
          },
        },
        createPostCategoryDto,
      );
      if (!response.success) {
        const message = JSON.stringify(response.data, null, 4);
        throw new Error(`assert - ${message}`);
      }

      const category = response.data;
      expect(category.name).toEqual('new post category');
    });
  });

  describe('Update category', () => {
    it('should be update category success', async () => {
      const admin = (
        await seedUsers({ count: 1, role: 'admin' }, drizzle.db)
      )[0];

      const categoryId: Uuid = typia.random<Uuid>();
      await createPostCategory(
        {
          id: categoryId,
          name: 'category',
          description: 'UPDATE category test',
          parentId: null,
        },
        {
          readableRoles: ['guest'],
          writableRoles: ['user', 'teacher', 'manager', 'admin'],
        },
        drizzle.db,
      );
      const updatePostCategoryDto: UpdatePostCategoryDto = {
        name: 'updated',
      };

      const updateResponse = await PostCategoryAPI.updatePostCategory(
        {
          host,
          headers: {
            LmsSecret,
            UserSessionId: admin.userSession.id,
          },
        },
        categoryId,
        updatePostCategoryDto,
      );
      if (!updateResponse.success) {
        const message = JSON.stringify(updateResponse.data, null, 4);
        throw new Error(`assert - ${message}`);
      }

      const updatedPostCategory = updateResponse.data;
      expect(updatedPostCategory.name).toEqual('updated');
    });

    it('should be update category fail', async () => {
      const admin = (
        await seedUsers({ count: 1, role: 'admin' }, drizzle.db)
      )[0];

      const notFoundId = typia.random<Uuid>();
      const updatePostCategoryDto = typia.random<UpdatePostCategoryDto>();

      const notFoundResponse = await PostCategoryAPI.updatePostCategory(
        {
          host,
          headers: {
            LmsSecret,
            UserSessionId: admin.userSession.id,
          },
        },
        notFoundId,
        updatePostCategoryDto,
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
      await createPostCategory(
        {
          id: categoryId,
          name: 'category',
          description: 'DELETE category test',
          parentId: null,
        },
        {
          readableRoles: ['guest'],
          writableRoles: ['user', 'teacher', 'manager', 'admin'],
        },
        drizzle.db,
      );

      const deleteResponse = await PostCategoryAPI.deletePostCategory(
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
        const message = JSON.stringify(deleteResponse.data, null, 4);
        throw new Error(`assert - ${message}`);
      }

      expect(deleteResponse.status).toEqual(200);

      const getResponse = await PostCategoryAPI.getPostCategory(
        {
          host,
          headers: { LmsSecret },
        },
        categoryId,
        { withChildren: false },
      );
      if (!getResponse.success) {
        const message = JSON.stringify(getResponse.data, null, 4);
        throw new Error(`assert - ${message}`);
      }

      const foundPostCategory = getResponse.data;
      expect(foundPostCategory).toBe(null);
    });
  });
});
