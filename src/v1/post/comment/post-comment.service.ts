import { Injectable } from '@nestjs/common';
import { PostCommentQueryRepository } from '@src/v1/post/comment/post-comment-query.repository';
import { PostCommentRepository } from '@src/v1/post/comment/post-comment.repository';
import { IPostComment } from '@src/v1/post/comment/post-comment.interface';
import { Pagination } from '@src/shared/types/pagination';

@Injectable()
export class PostCommentService {
  constructor(
    private readonly postCommentRepository: PostCommentRepository,
    private readonly postCommentQueryRepository: PostCommentQueryRepository,
  ) {}

  async findPostComments(
    where: Pick<IPostComment, 'postId'>,
    pagination: Pagination,
  ) {
    return await this.postCommentQueryRepository.findPostComments(
      where,
      pagination,
    );
  }
}
