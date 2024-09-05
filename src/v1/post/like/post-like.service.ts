import { ConflictException, Injectable } from '@nestjs/common';
import { PostLikeQueryRepository } from '@src/v1/post/like/post-like-query.repository';
import { PostLikeRepository } from '@src/v1/post/like/post-like.repository';
import {
  IPostLike,
  IPostLikeCreate,
} from '@src/v1/post/like/post-like.interface';
import { PostQueryService } from '@src/v1/post/post-query.service';

@Injectable()
export class PostLikeService {
  constructor(
    private readonly postQueryService: PostQueryService,
    private readonly postLikeRepository: PostLikeRepository,
    private readonly postLikeQueryRepository: PostLikeQueryRepository,
  ) {}

  async createPostLike(params: IPostLikeCreate): Promise<IPostLike> {
    await this.postQueryService.findPostOrThrow({ id: params.postId });

    const alreadyLike = await this.postLikeQueryRepository.findPostLike(params);

    if (alreadyLike) {
      throw new ConflictException('Already liked');
    }

    return await this.postLikeRepository.createPostLike(params);
  }
}
