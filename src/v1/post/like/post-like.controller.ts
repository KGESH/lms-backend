import { Controller } from '@nestjs/common';
import { PostLikeService } from '@src/v1/post/like/post-like.service';
import { TypedBody, TypedHeaders, TypedParam, TypedRoute } from '@nestia/core';
import { AuthHeaders } from '@src/v1/auth/auth.headers';
import {
  CreatePostLikeDto,
  PostLikeDto,
} from '@src/v1/post/like/post-like.dto';
import { Uuid } from '@src/shared/types/primitive';

@Controller('v1/post/:postId/like')
export class PostLikeController {
  constructor(private readonly postLikeService: PostLikeService) {}

  /**
   * 게시글에 대한 '좋아요'를 생성합니다.
   *
   * 이미 '좋아요'한 사용자는 중복해서 '좋아요'를 생성할 수 없습니다.
   *
   * @tag post-like
   * @summary 게시글 '좋아요' 생성
   */
  @TypedRoute.Post('/')
  async createPostLike(
    @TypedHeaders() headers: AuthHeaders,
    @TypedParam('postId') postId: Uuid,
    @TypedBody() body: CreatePostLikeDto,
  ): Promise<PostLikeDto> {
    return await this.postLikeService.createPostLike({
      postId,
      userId: body.userId,
    });
  }
}
