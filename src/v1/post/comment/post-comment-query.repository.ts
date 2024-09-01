import { Injectable } from '@nestjs/common';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import {
  IPostComment,
  IPostCommentPagination,
} from '@src/v1/post/comment/post-comment.interface';
import {
  IPostCommentRelations,
  IPostCommentRelationsWithChildren,
} from '@src/v1/post/comment/post-comment-relations.interface';
import { and, eq, isNull } from 'drizzle-orm';
import { dbSchema } from '@src/infra/db/schema';
import { Pagination } from '@src/shared/types/pagination';

@Injectable()
export class PostCommentQueryRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async findPostComment(
    where: Pick<IPostComment, 'id'>,
  ): Promise<IPostComment | null> {
    const comment = await this.drizzle.db.query.postComments.findFirst({
      where: eq(dbSchema.postComments.id, where.id),
    });

    return comment ?? null;
  }

  async findPostComments(
    where: Pick<IPostComment, 'postId'>,
    pagination: Pagination,
  ): Promise<IPostCommentRelations[]> {
    const comments = await this.drizzle.db.query.postComments.findMany({
      where: and(
        eq(dbSchema.postComments.postId, where.postId),
        isNull(dbSchema.postComments.parentId),
      ),
      with: {
        user: true,
        snapshots: {
          orderBy: (snapshot, { desc }) => desc(snapshot.createdAt),
          limit: 1,
        },
      },
      orderBy: (comment, { asc, desc }) =>
        pagination.orderBy === 'asc'
          ? asc(comment.createdAt)
          : desc(comment.createdAt),
      offset: (pagination.page - 1) * pagination.pageSize,
      limit: pagination.pageSize,
    });

    return comments.map((comment) => ({
      ...comment,
      user: comment.user,
      snapshot: comment.snapshots[0],
    }));
  }

  async findPostCommentsWithChildren(
    where: Pick<IPostComment, 'postId'>,
    { parentPagination, childrenPagination }: IPostCommentPagination,
  ): Promise<IPostCommentRelationsWithChildren[]> {
    const comments = await this.drizzle.db.query.postComments.findMany({
      where: and(
        eq(dbSchema.postComments.postId, where.postId),
        isNull(dbSchema.postComments.parentId),
      ),
      with: {
        user: true,
        snapshots: {
          orderBy: (snapshot, { desc }) => desc(snapshot.createdAt),
          limit: 1,
        },
        children: {
          orderBy: (child, { asc, desc }) =>
            childrenPagination.orderBy === 'asc'
              ? asc(child.createdAt)
              : desc(child.createdAt),
          limit: childrenPagination.pageSize,
          with: {
            user: true,
            snapshots: {
              orderBy: (snapshot, { desc }) => desc(snapshot.createdAt),
              limit: 1,
            },
          },
        },
      },
      orderBy: (comment, { asc, desc }) =>
        parentPagination.orderBy === 'asc'
          ? asc(comment.createdAt)
          : desc(comment.createdAt),
      offset: (parentPagination.page - 1) * parentPagination.pageSize,
      limit: parentPagination.pageSize,
    });

    return comments.map((comment) => ({
      ...comment,
      user: comment.user,
      snapshot: comment.snapshots[0],
      children: comment.children.map((child) => ({
        ...child,
        user: child.user,
        snapshot: child.snapshots[0],
      })),
    }));
  }

  async findPostCommentWithChildren(
    where: Pick<IPostComment, 'id'>,
  ): Promise<IPostCommentRelationsWithChildren | null> {
    const comment = await this.drizzle.db.query.postComments.findFirst({
      where: eq(dbSchema.postComments.id, where.id),
      with: {
        user: true,
        snapshots: {
          orderBy: (snapshot, { desc }) => desc(snapshot.createdAt),
          limit: 1,
        },
        children: {
          with: {
            user: true,
            snapshots: {
              orderBy: (snapshot, { desc }) => desc(snapshot.createdAt),
              limit: 1,
            },
          },
        },
      },
    });

    if (!comment) {
      return null;
    }

    return {
      ...comment,
      user: comment.user,
      snapshot: comment.snapshots[0],
      children: comment.children.map((child) => ({
        ...child,
        user: child.user,
        snapshot: child.snapshots[0],
      })),
    };
  }
}
