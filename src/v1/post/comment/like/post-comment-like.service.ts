import { ConflictException, Injectable } from '@nestjs/common';
import {
  IPostCommentLike,
  IPostCommentLikeCreate,
} from '@src/v1/post/comment/like/post-comment-like.interface';
import { PostCommentLikeRepository } from '@src/v1/post/comment/like/post-comment-like.repository';
import { PostCommentLikeQueryRepository } from '@src/v1/post/comment/like/post-comment-like-query.repository';
import { PostCommentService } from '@src/v1/post/comment/post-comment.service';

@Injectable()
export class PostCommentLikeService {
  constructor(
    private readonly postCommentService: PostCommentService,
    private readonly postCommentLikeRepository: PostCommentLikeRepository,
    private readonly postCommentLikeQueryRepository: PostCommentLikeQueryRepository,
  ) {}

  async createPostCommentLike(
    params: IPostCommentLikeCreate,
  ): Promise<IPostCommentLike> {
    await this.postCommentService.findPostCommentOrThrow({
      id: params.commentId,
    });

    const alreadyLike =
      await this.postCommentLikeQueryRepository.findPostCommentLike(params);

    if (alreadyLike) {
      throw new ConflictException('Already liked');
    }

    return await this.postCommentLikeRepository.createPostCommentLike(params);
  }
}
