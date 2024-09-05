import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PostCommentQueryRepository } from '@src/v1/post/comment/post-comment-query.repository';
import { PostCommentRepository } from '@src/v1/post/comment/post-comment.repository';
import {
  IPostComment,
  IPostCommentCreate,
  IPostCommentPagination,
} from '@src/v1/post/comment/post-comment.interface';
import {
  IPostCommentRelations,
  IPostCommentRelationsWithChildren,
} from '@src/v1/post/comment/post-comment-relations.interface';
import { PostCommentSnapshotRepository } from '@src/v1/post/comment/post-comment-snapshot.repository';
import { IPostCommentSnapshotCreate } from '@src/v1/post/comment/post-comment-snapshot.interface';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import * as typia from 'typia';
import { IUserWithoutPassword } from '@src/v1/user/user.interface';
import { PostQueryService } from '@src/v1/post/post-query.service';

@Injectable()
export class PostCommentService {
  constructor(
    private readonly postQueryService: PostQueryService,
    private readonly postCommentRepository: PostCommentRepository,
    private readonly postCommentSnapshotRepository: PostCommentSnapshotRepository,
    private readonly postCommentQueryRepository: PostCommentQueryRepository,
    private readonly drizzle: DrizzleService,
  ) {}

  async findPostCommentOrThrow(
    where: Pick<IPostComment, 'id'>,
  ): Promise<IPostComment> {
    const comment =
      await this.postCommentQueryRepository.findPostComment(where);

    if (!comment) {
      throw new NotFoundException('Post comment not found');
    }

    return comment;
  }

  async findPostRootComments(
    where: Pick<IPostComment, 'postId'>,
    { parentPagination, childrenPagination }: IPostCommentPagination,
  ): Promise<IPostCommentRelationsWithChildren[]> {
    await this.postQueryService.findPostOrThrow({ id: where.postId });

    return await this.postCommentQueryRepository.findPostCommentsWithChildren(
      where,
      { parentPagination, childrenPagination },
    );
  }

  async findPostCommentWithChildren(
    where: Pick<IPostComment, 'id'>,
  ): Promise<IPostCommentRelationsWithChildren | null> {
    return await this.postCommentQueryRepository.findPostCommentWithChildren(
      where,
    );
  }

  async createPostComment({
    createParams,
    snapshotCreateParams,
  }: {
    createParams: IPostCommentCreate;
    snapshotCreateParams: Omit<IPostCommentSnapshotCreate, 'commentId'>;
  }): Promise<Omit<IPostCommentRelations, 'user'>> {
    await this.postQueryService.findPostOrThrow({ id: createParams.postId });

    return await this.drizzle.db.transaction(async (tx) => {
      const postComment = await this.postCommentRepository.createPostComment(
        createParams,
        tx,
      );
      const snapshot =
        await this.postCommentSnapshotRepository.createPostCommentSnapshot(
          {
            ...snapshotCreateParams,
            commentId: postComment.id,
          },
          tx,
        );

      return {
        ...postComment,
        snapshot,
      };
    });
  }

  async updatePostComment(
    user: IUserWithoutPassword,
    params: IPostCommentSnapshotCreate,
  ): Promise<IPostCommentRelationsWithChildren> {
    const comment = await this.findPostCommentOrThrow({ id: params.commentId });

    // If the user is not an admin, they can only update their own comments
    if (
      (user.role === 'user' || user.role === 'teacher') &&
      comment.userId !== user.id
    ) {
      throw new ForbiddenException(
        'You are not allowed to update this comment',
      );
    }

    const newSnapshot =
      await this.postCommentSnapshotRepository.createPostCommentSnapshot({
        ...params,
        commentId: comment.id,
      });

    const updated = await this.findPostCommentWithChildren({ id: comment.id });

    return typia.assert<IPostCommentRelationsWithChildren>(updated);
  }

  async deletePostComment(
    user: IUserWithoutPassword,
    where: Pick<IPostComment, 'id'>,
  ): Promise<Pick<IPostComment, 'id'>> {
    const comment = await this.findPostCommentOrThrow(where);

    // If the user is not an admin, they can only delete their own comments
    if (
      (user.role === 'user' || user.role === 'teacher') &&
      comment.userId !== user.id
    ) {
      throw new ForbiddenException(
        'You are not allowed to delete this comment',
      );
    }

    await this.drizzle.db.transaction(async (tx) => {
      await this.postCommentRepository.deletePostComment(where, tx);
      await this.postCommentSnapshotRepository.createPostCommentSnapshot(
        {
          commentId: where.id,
          content: '삭제된 댓글입니다.', // Todo: Extract
        },
        tx,
      );
    });

    return { id: comment.id };
  }
}
