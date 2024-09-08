import * as PostCommentAPI from '../../../src/api/functional/v1/post/comment';
import * as PostCommentLikeAPI from '../../../src/api/functional/v1/post/comment/like';
import { Uri } from '@src/shared/types/primitive';
import { INestApplication } from '@nestjs/common';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import { ConfigsService } from '@src/configs/configs.service';
import { createTestingServer } from '../helpers/app.helper';
import { createPostCategory } from '../helpers/db/lms/post-category.helper';
import { seedUsers } from '../helpers/db/lms/user.helper';
import { seedPostComment, seedPosts } from '../helpers/db/lms/post.helper';

describe('PostCommentController (e2e)', () => {
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

  describe('[Get post comment]', () => {
    // it('should be get a post success', async () => {
    //   const [{ user: author }, { user: replier }] = await seedUsers(
    //     { count: 2, role: 'user' },
    //     drizzle.db,
    //   );
    //   const [post] = await seedPosts({ count: 1, author }, drizzle.db);
    //   const [comment] = post.comments;
    //   const [reply] = await seedPostComment(
    //     {
    //       parentId: comment.id,
    //       postId: post.id,
    //       users: [replier],
    //     },
    //     drizzle.db,
    //   );
    //
    //   const response = await PostCommentAPI.getPostCommentWithChildren(
    //     {
    //       host,
    //       headers: { LmsSecret },
    //     },
    //     post.id,
    //     comment.id,
    //   );
    //   if (!response.success) {
    //     const message = JSON.stringify(response.data, null, 4);
    //     throw new Error(`assert - ${message}`);
    //   }
    //
    //   const foundComment = response.data;
    //   const foundReply = foundComment!.children.find((c) => c.id === reply.id);
    //   expect(foundReply!.parentId).toEqual(foundComment!.id);
    //   expect(foundReply!.user.id).toEqual(replier.id);
    // });

    it('should be get a post comment with children success', async () => {
      const [{ user: author }, { user: replier }] = await seedUsers(
        { count: 2, role: 'user' },
        drizzle.db,
      );
      const [post] = await seedPosts({ count: 1, author }, drizzle.db);
      const [comment] = post.comments;
      const [reply] = await seedPostComment(
        {
          parentId: comment.id,
          postId: post.id,
          users: [replier],
        },
        drizzle.db,
      );

      const response = await PostCommentAPI.getPostCommentWithChildren(
        {
          host,
          headers: { LmsSecret },
        },
        post.id,
        comment.id,
      );
      if (!response.success) {
        const message = JSON.stringify(response.data, null, 4);
        throw new Error(`assert - ${message}`);
      }

      const foundComment = response.data;
      const foundReply = foundComment!.children.find((c) => c.id === reply.id);
      expect(foundReply!.parentId).toEqual(foundComment!.id);
      expect(foundReply!.user.id).toEqual(replier.id);
    });
  });

  // describe('[Get post comments by post ID]', () => {
  //   it('should be get many posts by category ID success', async () => {
  //     const [{ user: author }] = await seedUsers(
  //       { count: 1, role: 'user' },
  //       drizzle.db,
  //     );
  //     const [post] = await seedPosts({ count: 1, author }, drizzle.db);
  //
  //     const response = await PostCommentAPI.getPostRootComments(
  //       {
  //         host,
  //         headers: { LmsSecret },
  //       },
  //       post.id,
  //       {
  //         page: 1,
  //         pageSize: 10, // Comment count
  //         orderBy: 'asc', // createdAt
  //       },
  //     );
  //     if (!response.success) {
  //       const message = JSON.stringify(response.data, null, 4);
  //       throw new Error(`assert - ${message}`);
  //     }
  //
  //     const foundComments = response.data;
  //     expect(foundComments[0].).toEqual(category.id);
  //     expect(posts.find((p) => p.id === foundPosts[0].id)).toBeDefined();
  //   });
  // });
  //
  // describe('[Create post]', () => {
  //   it('should be create post success', async () => {
  //     const [student] = await seedUsers({ count: 1, role: 'user' }, drizzle.db);
  //     const category = await createPostCategory(
  //       {
  //         name: 'seed post category',
  //         description: 'seed post category',
  //         parentId: null,
  //       },
  //       drizzle.db,
  //     );
  //
  //     const createPostDto: CreatePostDto = {
  //       title: 'new post',
  //       content: 'new post content',
  //       userId: student.user.id,
  //       categoryId: category.id,
  //     };
  //     const response = await PostAPI.createPost(
  //       {
  //         host,
  //         headers: {
  //           LmsSecret,
  //           UserSessionId: student.userSession.id,
  //         },
  //       },
  //       createPostDto,
  //     );
  //     if (!response.success) {
  //       const message = JSON.stringify(response.data, null, 4);
  //       throw new Error(`assert - ${message}`);
  //     }
  //
  //     const createdPost = response.data;
  //     expect(createdPost.title).toEqual('new post');
  //     expect(createdPost.content).toEqual('new post content');
  //   });
  // });
  //
  // describe('[Update post]', () => {
  //   it('should be update post success (create new snapshot)', async () => {
  //     const [student] = await seedUsers({ count: 1, role: 'user' }, drizzle.db);
  //     const category = await createPostCategory(
  //       {
  //         name: 'seed post category',
  //         description: 'seed post category',
  //         parentId: null,
  //       },
  //       drizzle.db,
  //     );
  //     const [post] = await seedPosts(
  //       {
  //         count: 1,
  //         author: student.user,
  //         category,
  //       },
  //       drizzle.db,
  //     );
  //
  //     const updatePostDto: UpdatePostDto = {
  //       title: 'updated post',
  //       content: 'updated post content',
  //     };
  //     const updatedResponse = await PostAPI.updatePost(
  //       {
  //         host,
  //         headers: {
  //           LmsSecret,
  //           UserSessionId: student.userSession.id,
  //         },
  //       },
  //       post.id,
  //       updatePostDto,
  //     );
  //     if (!updatedResponse.success) {
  //       const message = JSON.stringify(updatedResponse.data, null, 4);
  //       throw new Error(`assert - ${message}`);
  //     }
  //
  //     const updatedPost = updatedResponse.data;
  //     expect(updatedPost.title).toEqual('updated post');
  //     expect(updatedPost.content).toEqual('updated post content');
  //
  //     const updateOnlyContentDto: UpdatePostDto = {
  //       content: 'updated only content',
  //     };
  //     const updated2Response = await PostAPI.updatePost(
  //       {
  //         host,
  //         headers: {
  //           LmsSecret,
  //           UserSessionId: student.userSession.id,
  //         },
  //       },
  //       post.id,
  //       updateOnlyContentDto,
  //     );
  //     if (!updated2Response.success) {
  //       const message = JSON.stringify(updated2Response.data, null, 4);
  //       throw new Error(`assert - ${message}`);
  //     }
  //
  //     const updatedOnlyContentPost = updated2Response.data;
  //     expect(updatedOnlyContentPost.title).toEqual('updated post');
  //     expect(updatedOnlyContentPost.content).toEqual('updated only content');
  //   });
  // });

  // describe('[Delete post', () => {
  //   it('should be delete post success (soft delete)', async () => {
  //     const [student] = await seedUsers({ count: 1, role: 'user' }, drizzle.db);
  //     const [post] = await seedPosts(
  //       {
  //         count: 1,
  //         author: student.user,
  //       },
  //       drizzle.db,
  //     );
  //
  //     const deletedResponse = await PostAPI.deletePost(
  //       {
  //         host,
  //         headers: {
  //           LmsSecret,
  //           UserSessionId: student.userSession.id,
  //         },
  //       },
  //       post.id,
  //     );
  //     if (!deletedResponse.success) {
  //       const message = JSON.stringify(deletedResponse.data, null, 4);
  //       throw new Error(`assert - ${message}`);
  //     }
  //
  //     const deletedResult = deletedResponse.data;
  //     expect(deletedResult.id).toEqual(post.id);
  //
  //     const getResponse = await PostAPI.getPostById(
  //       {
  //         host,
  //         headers: { LmsSecret },
  //       },
  //       post.id,
  //       {},
  //     );
  //     if (!getResponse.success) {
  //       const message = JSON.stringify(getResponse.data, null, 4);
  //       throw new Error(`assert - ${message}`);
  //     }
  //
  //     const foundPost = getResponse.data;
  //     expect(foundPost).toBeNull();
  //   });
  // });

  // describe('[Create post like]', () => {
  //   it('should be create post like success', async () => {
  //     const [author, likedUser] = await seedUsers(
  //       { count: 2, role: 'user' },
  //       drizzle.db,
  //     );
  //     const [post] = await seedPosts(
  //       {
  //         count: 1,
  //         author: author.user,
  //       },
  //       drizzle.db,
  //     );
  //
  //     const likedResponse = await PostLikeAPI.createPostLike(
  //       {
  //         host,
  //         headers: {
  //           LmsSecret,
  //           UserSessionId: likedUser.userSession.id,
  //         },
  //       },
  //       post.id,
  //     );
  //     if (!likedResponse.success) {
  //       const message = JSON.stringify(likedResponse.data, null, 4);
  //       throw new Error(`assert - ${message}`);
  //     }
  //
  //     const liked = likedResponse.data;
  //     expect(liked.postId).toEqual(post.id);
  //     expect(liked.userId).toEqual(likedUser.user.id);
  //
  //     const afterLikedPostResponse = await PostAPI.getPostById(
  //       {
  //         host,
  //         headers: { LmsSecret },
  //       },
  //       post.id,
  //       {},
  //     );
  //     if (!afterLikedPostResponse.success) {
  //       const message = JSON.stringify(afterLikedPostResponse.data, null, 4);
  //       throw new Error(`assert - ${message}`);
  //     }
  //
  //     const afterLikedPost = afterLikedPostResponse.data;
  //     expect(afterLikedPost!.likeCount).toEqual(post.likeCount + 2);
  //   });
  // });
});
