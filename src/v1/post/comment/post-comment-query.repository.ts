import { Injectable } from '@nestjs/common';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import { IPostComment } from '@src/v1/post/comment/post-comment.interface';
import { IPostCommentRelations } from '@src/v1/post/comment/post-comment-relations.interface';
import { eq } from 'drizzle-orm';
import { dbSchema } from '@src/infra/db/schema';
import { Pagination } from '@src/shared/types/pagination';

@Injectable()
export class PostCommentQueryRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async findPostComments(
    where: Pick<IPostComment, 'postId'>,
    pagination: Pagination,
  ): Promise<IPostCommentRelations[]> {
    const comments = await this.drizzle.db.query.postComments.findMany({
      where: eq(dbSchema.postComments.postId, where.postId),
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
}
