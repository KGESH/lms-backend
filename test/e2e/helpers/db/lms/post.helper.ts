import { dbSchema } from '../../../../../src/infra/db/schema';
import { TransactionClient } from '../../../../../src/infra/db/drizzle.types';
import { IPost, IPostCreate } from '@src/v1/post/post.interface';
import {
  IPostSnapshot,
  IPostSnapshotCreate,
} from '@src/v1/post/post-snapshot.interface';
import { seedPostCategoriesWithChildren } from './post-category.helper';
import { Uuid } from '@src/shared/types/primitive';
import { seedUsers } from './user.helper';
import {
  IPostComment,
  IPostCommentCreate,
} from '@src/v1/post/comment/post-comment.interface';
import {
  IPostCommentSnapshot,
  IPostCommentSnapshotCreate,
} from '@src/v1/post/comment/post-comment-snapshot.interface';
import * as typia from 'typia';
import {
  IPostLike,
  IPostLikeCreate,
} from '@src/v1/post/like/post-like.interface';
import { IPostCommentRelationsWithChildren } from '@src/v1/post/comment/post-comment-relations.interface';
import { IPostWithComments } from '@src/v1/post/post-relations.interface';
import { IUserWithoutPassword } from '@src/v1/user/user.interface';
import { IPostCategory } from '@src/v1/post/category/post-category.interface';

export const createPost = async (
  params: IPostCreate,
  db: TransactionClient,
): Promise<IPost> => {
  const [post] = await db.insert(dbSchema.posts).values(params).returning();

  return post;
};

export const createPostSnapshot = async (
  params: IPostSnapshotCreate,
  db: TransactionClient,
): Promise<IPostSnapshot> => {
  const [snapshot] = await db
    .insert(dbSchema.postSnapshots)
    .values(typia.misc.clone(params))
    .returning();

  return snapshot;
};

export const createPostComment = async (
  params: IPostCommentCreate,
  db: TransactionClient,
): Promise<IPostComment> => {
  const [comment] = await db
    .insert(dbSchema.postComments)
    .values(params)
    .returning();

  return comment;
};

export const createPostCommentSnapshot = async (
  params: IPostCommentSnapshotCreate,
  db: TransactionClient,
): Promise<IPostCommentSnapshot> => {
  const [snapshot] = await db
    .insert(dbSchema.postCommentSnapshots)
    .values(typia.misc.clone(params))
    .returning();

  return snapshot;
};

export const createPostLike = async (
  params: IPostLikeCreate,
  db: TransactionClient,
): Promise<IPostLike> => {
  const [like] = await db.insert(dbSchema.postLikes).values(params).returning();

  return like;
};

export const createManyPostLikes = async (
  createManyParams: IPostLikeCreate[],
  db: TransactionClient,
): Promise<IPostLike[]> => {
  const likes = await db
    .insert(dbSchema.postLikes)
    .values(createManyParams)
    .returning();
  return likes;
};

export const seedPostComment = async (
  {
    postId,
    users,
    parentId,
  }: { postId: Uuid; users: IUserWithoutPassword[]; parentId?: Uuid },
  db: TransactionClient,
): Promise<IPostCommentRelationsWithChildren[]> => {
  const comments: IPostCommentRelationsWithChildren[] = [];
  for (const [index, user] of users.entries()) {
    const comment = await createPostComment(
      {
        postId,
        userId: user.id,
        parentId: parentId ?? null,
      },
      db,
    );
    const commentSnapshot = await createPostCommentSnapshot(
      {
        commentId: comment.id,
        content: `mock comment ${index}`,
      },
      db,
    );

    comments.push({
      ...comment,
      snapshot: commentSnapshot,
      user,
      children: [],
    });
  }

  return comments;
};

export const createPostRelations = async (
  author: IUserWithoutPassword,
  category: IPostCategory,
  db: TransactionClient,
): Promise<IPostWithComments> => {
  const postCommenters = await seedUsers({ count: 5 }, db);

  const post = await createPost(
    {
      categoryId: category.id,
      userId: author.id,
      viewCount: 0,
    },
    db,
  );
  const postSnapshot = await createPostSnapshot(
    {
      postId: post.id,
      title: 'mock post',
      content: 'mock post content',
    },
    db,
  );
  const comments = await seedPostComment(
    {
      postId: post.id,
      users: postCommenters.map((commenter) => commenter.user),
    },
    db,
  );

  const parentCommentIds = comments.map((comment) => comment.id);
  const childrenComments = (
    await Promise.all(
      parentCommentIds.map((parentCommentId) =>
        seedPostComment(
          {
            postId: post.id,
            users: postCommenters.map((commenter) => commenter.user),
            parentId: parentCommentId,
          },
          db,
        ),
      ),
    )
  ).flat();

  for (const parentComment of comments) {
    const children = childrenComments.filter(
      (child) => child.parentId === parentComment.id,
    );
    parentComment.children.push(...children);
  }

  const likes = await createManyPostLikes(
    postCommenters.map((commenter) => ({
      postId: post.id,
      userId: commenter.user.id,
    })),
    db,
  );

  return {
    ...post,
    category,
    author,
    comments,
    snapshot: postSnapshot,
    likeCount: likes.length,
    commentCount: comments.length,
  };
};

export const seedPosts = async (
  params: {
    count: number;
    author?: IUserWithoutPassword;
    category?: IPostCategory;
  },
  db: TransactionClient,
): Promise<IPostWithComments[]> => {
  const author =
    params.author ?? (await seedUsers({ count: 1, role: 'user' }, db))[0].user;
  const category =
    params.category ??
    (await seedPostCategoriesWithChildren({ count: 1 }, db)).rootCategories[0];

  const posts = await Promise.all(
    Array.from({ length: params.count }).map(() =>
      createPostRelations(author, category, db),
    ),
  );

  return posts;
};
