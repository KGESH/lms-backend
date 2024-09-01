import * as PostAPI from '../../../src/api/functional/v1/post';
import { Uri } from '@src/shared/types/primitive';
import { INestApplication } from '@nestjs/common';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import { ConfigsService } from '@src/configs/configs.service';
import { createTestingServer } from '../helpers/app.helper';
import { createPostCategory } from '../helpers/db/lms/post-category.helper';
import { seedUsers } from '../helpers/db/lms/user.helper';
import { CreatePostDto, UpdatePostDto } from '@src/v1/post/post.dto';
import { createPostSnapshot, seedPosts } from '../helpers/db/lms/post.helper';

describe('PostController (e2e)', () => {
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

  describe('[Get post]', () => {
    it('should be get a post success', async () => {
      const [{ user: author }] = await seedUsers(
        { count: 1, role: 'user' },
        drizzle.db,
      );
      const category = await createPostCategory(
        {
          name: 'seed post category',
          description: 'seed post category',
          parentId: null,
        },
        drizzle.db,
      );
      const [post] = await seedPosts(
        { count: 1, author, category },
        drizzle.db,
      );
      await createPostSnapshot(
        {
          postId: post.id,
          title: 'edited post title',
          content: 'edited content',
        },
        drizzle.db,
      );

      const response = await PostAPI.getPostById(
        {
          host,
          headers: { LmsSecret },
        },
        post.id,
        {},
      );
      if (!response.success) {
        const message = JSON.stringify(response.data, null, 4);
        throw new Error(`assert - ${message}`);
      }

      const foundPost = response.data;
      expect(foundPost!.title).toEqual('edited post title');
      expect(foundPost!.content).toEqual('edited content');
    });
  });

  describe('[Get posts by category ID]', () => {
    it('should be get many posts by category ID success', async () => {
      const category = await createPostCategory(
        {
          name: 'seed post category',
          description: 'seed post category',
          parentId: null,
        },
        drizzle.db,
      );
      const posts = await seedPosts({ count: 3, category }, drizzle.db);

      const response = await PostAPI.getPostsByCategory(
        {
          host,
          headers: { LmsSecret },
        },
        {
          categoryId: category.id,
          page: 1,
          pageSize: 10,
          orderBy: 'desc',
        },
      );
      if (!response.success) {
        const message = JSON.stringify(response.data, null, 4);
        throw new Error(`assert - ${message}`);
      }

      const foundPosts = response.data;
      expect(foundPosts[0].categoryId).toEqual(category.id);
      expect(posts.find((p) => p.id === foundPosts[0].id)).toBeDefined();
    });
  });

  describe('[Create post]', () => {
    it('should be create post success', async () => {
      const [student] = await seedUsers({ count: 1, role: 'user' }, drizzle.db);
      const category = await createPostCategory(
        {
          name: 'seed post category',
          description: 'seed post category',
          parentId: null,
        },
        drizzle.db,
      );

      const createPostDto: CreatePostDto = {
        title: 'new post',
        content: 'new post content',
        userId: student.user.id,
        categoryId: category.id,
      };
      const response = await PostAPI.createPost(
        {
          host,
          headers: {
            LmsSecret,
            UserSessionId: student.userSession.id,
          },
        },
        createPostDto,
      );
      if (!response.success) {
        const message = JSON.stringify(response.data, null, 4);
        throw new Error(`assert - ${message}`);
      }

      const createdPost = response.data;
      expect(createdPost.title).toEqual('new post');
      expect(createdPost.content).toEqual('new post content');
    });
  });

  describe('[Update post]', () => {
    it('should be update post success (create new snapshot)', async () => {
      const [student] = await seedUsers({ count: 1, role: 'user' }, drizzle.db);
      const category = await createPostCategory(
        {
          name: 'seed post category',
          description: 'seed post category',
          parentId: null,
        },
        drizzle.db,
      );
      const [post] = await seedPosts(
        {
          count: 1,
          author: student.user,
          category,
        },
        drizzle.db,
      );

      const updatePostDto: UpdatePostDto = {
        title: 'updated post',
        content: 'updated post content',
      };
      const updatedResponse = await PostAPI.updatePost(
        {
          host,
          headers: {
            LmsSecret,
            UserSessionId: student.userSession.id,
          },
        },
        post.id,
        updatePostDto,
      );
      if (!updatedResponse.success) {
        const message = JSON.stringify(updatedResponse.data, null, 4);
        throw new Error(`assert - ${message}`);
      }

      const updatedPost = updatedResponse.data;
      expect(updatedPost.title).toEqual('updated post');
      expect(updatedPost.content).toEqual('updated post content');

      const updateOnlyContentDto: UpdatePostDto = {
        content: 'updated only content',
      };
      const updated2Response = await PostAPI.updatePost(
        {
          host,
          headers: {
            LmsSecret,
            UserSessionId: student.userSession.id,
          },
        },
        post.id,
        updateOnlyContentDto,
      );
      if (!updated2Response.success) {
        const message = JSON.stringify(updated2Response.data, null, 4);
        throw new Error(`assert - ${message}`);
      }

      const updatedOnlyContentPost = updated2Response.data;
      expect(updatedOnlyContentPost.title).toEqual('updated post');
      expect(updatedOnlyContentPost.content).toEqual('updated only content');
    });
  });

  describe('[Delete post', () => {
    it('should be delete post success (soft delete)', async () => {
      const [student] = await seedUsers({ count: 1, role: 'user' }, drizzle.db);
      const [post] = await seedPosts(
        {
          count: 1,
          author: student.user,
        },
        drizzle.db,
      );

      const deletedResponse = await PostAPI.deletePost(
        {
          host,
          headers: {
            LmsSecret,
            UserSessionId: student.userSession.id,
          },
        },
        post.id,
      );
      if (!deletedResponse.success) {
        const message = JSON.stringify(deletedResponse.data, null, 4);
        throw new Error(`assert - ${message}`);
      }

      const deletedResult = deletedResponse.data;
      expect(deletedResult.id).toEqual(post.id);

      const getResponse = await PostAPI.getPostById(
        {
          host,
          headers: { LmsSecret },
        },
        post.id,
        {},
      );
      if (!getResponse.success) {
        const message = JSON.stringify(getResponse.data, null, 4);
        throw new Error(`assert - ${message}`);
      }

      const foundPost = getResponse.data;
      expect(foundPost).toBeNull();
    });
  });
});
