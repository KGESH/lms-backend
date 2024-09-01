import { Injectable } from '@nestjs/common';
import { PostRepository } from '@src/v1/post/post.repository';
import { IPost, IPostCreate } from '@src/v1/post/post.interface';
import { PostQueryRepository } from '@src/v1/post/post-query.repository';
import { Pagination } from '@src/shared/types/pagination';
import { PostSnapshotRepository } from '@src/v1/post/post-snapshot.repository';
import { IPostSnapshotCreate } from '@src/v1/post/post-snapshot.interface';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import {
  IPostContentUpdate,
  IPostWithComments,
  IPostRelations,
  IPostRelationsWithCommentCount,
} from '@src/v1/post/post-relations.interface';
import { PostCategoryService } from '@src/v1/post/category/post-category.service';
import { PostService } from '@src/v1/post/post.service';
import { PostCommentService } from '@src/v1/post/comment/post-comment.service';
import { DEFAULT_PAGINATION } from '@src/core/pagination.constant';
import * as typia from 'typia';

@Injectable()
export class PostRelationsService {
  constructor(
    private readonly postService: PostService,
    private readonly postCategoryService: PostCategoryService,
    private readonly postCommentService: PostCommentService,
    private readonly postRepository: PostRepository,
    private readonly postQueryRepository: PostQueryRepository,
    private readonly postSnapshotRepository: PostSnapshotRepository,
    private readonly drizzle: DrizzleService,
  ) {}

  async findPostsByCategory(
    where: Pick<IPost, 'categoryId'>,
    pagination: Pagination,
  ): Promise<IPostRelationsWithCommentCount[]> {
    const category = await this.postCategoryService.findPostCategoryOrThrow({
      id: where.categoryId,
    });

    return await this.postQueryRepository.findPostsByCategory(
      { categoryId: category.id },
      pagination,
    );
  }

  async findPostWithRelations(
    where: Pick<IPost, 'id'>,
  ): Promise<IPostRelations | null> {
    return await this.postQueryRepository.findPostWithRelations(where);
  }

  async findPostWithComments(
    where: Pick<IPost, 'id'>,
    {
      commentPagination,
    }: {
      commentPagination: Pagination;
    },
  ): Promise<IPostWithComments | null> {
    const post = await this.findPostWithRelations(where);

    if (!post) {
      return null;
    }

    const comments = await this.postCommentService.findPostRootComments(
      {
        postId: post.id,
      },
      {
        parentPagination: commentPagination,
        childrenPagination: DEFAULT_PAGINATION,
      },
    );

    return {
      ...post,
      comments,
      commentCount: comments.length,
    };
  }

  async createPost({
    postCreateParams,
    snapshotCreateParams,
  }: {
    postCreateParams: IPostCreate;
    snapshotCreateParams: Omit<IPostSnapshotCreate, 'postId'>;
  }): Promise<Omit<IPostWithComments, 'author'>> {
    const category = await this.postCategoryService.findPostCategoryOrThrow({
      id: postCreateParams.categoryId,
    });

    const postRelations = await this.drizzle.db.transaction(async (tx) => {
      const post = await this.postRepository.createPost(postCreateParams, tx);
      const snapshot = await this.postSnapshotRepository.createPostSnapshot(
        {
          ...snapshotCreateParams,
          postId: post.id,
        },
        tx,
      );

      return {
        ...post,
        snapshot,
        category,
        likeCount: 0,
        commentCount: 0,
        comments: [],
      } satisfies Omit<IPostWithComments, 'author'>;
    });

    return postRelations;
  }

  async updatePostContent(
    params: IPostContentUpdate,
  ): Promise<IPostWithComments> {
    // Check category exists
    if (params.categoryId) {
      await this.postCategoryService.findPostCategoryOrThrow({
        id: params.categoryId,
      });
    }

    const exists = await this.postService.findPostWithSnapshotOrThrow({
      id: params.postId,
    });

    const newSnapshot = await this.postSnapshotRepository.createPostSnapshot({
      ...exists.snapshot,
      ...params,
    });

    const newPost = await this.findPostWithComments(
      {
        id: newSnapshot.postId,
      },
      { commentPagination: DEFAULT_PAGINATION },
    );

    return typia.assert<IPostWithComments>(newPost);
  }

  // Soft delete
  async deletePost(where: Pick<IPost, 'id'>): Promise<IPost> {
    const post = await this.postService.findPostOrThrow(where);
    return await this.postRepository.deletePost(post);
  }
}
