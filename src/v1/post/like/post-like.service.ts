import { ConflictException, Injectable } from '@nestjs/common';
import { PostLikeQueryRepository } from '@src/v1/post/like/post-like-query.repository';
import { PostLikeRepository } from '@src/v1/post/like/post-like.repository';
import {
  IPostLike,
  IPostLikeCreate,
} from '@src/v1/post/like/post-like.interface';
import { PostService } from '@src/v1/post/post.service';

@Injectable()
export class PostLikeService {
  constructor(
    private readonly postService: PostService,
    private readonly postLikeRepository: PostLikeRepository,
    private readonly postLikeQueryRepository: PostLikeQueryRepository,
  ) {}

  async createPostLike(params: IPostLikeCreate): Promise<IPostLike> {
    await this.postService.findPostOrThrow({ id: params.postId });

    const alreadyLike = await this.postLikeQueryRepository.findPostLike(params);

    if (alreadyLike) {
      throw new ConflictException('Already liked');
    }

    return this.postLikeRepository.createPostLike(params);
  }
}
