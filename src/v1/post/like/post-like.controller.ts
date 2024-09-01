import { Controller } from '@nestjs/common';
import { PostLikeService } from '@src/v1/post/like/post-like.service';
import {
  TypedException,
  TypedHeaders,
  TypedParam,
  TypedRoute,
} from '@nestia/core';
import { AuthHeaders } from '@src/v1/auth/auth.headers';
import { PostLikeDto } from '@src/v1/post/like/post-like.dto';
import { Uuid } from '@src/shared/types/primitive';
import { TypeGuardError } from 'typia';
import { IErrorResponse } from '@src/shared/types/response';
import { SessionUser } from '@src/core/decorators/session-user.decorator';
import { ISessionWithUser } from '@src/v1/auth/session.interface';

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
   * @param postId - 게시글 ID
   */
  @TypedRoute.Post('/')
  @TypedException<TypeGuardError>({
    status: 400,
    description: 'invalid request',
  })
  @TypedException<IErrorResponse<404>>({
    status: 404,
    description: 'post not found',
  })
  @TypedException<IErrorResponse<409>>({
    status: 409,
    description: 'already liked',
  })
  async createPostLike(
    @TypedHeaders() headers: AuthHeaders,
    @TypedParam('postId') postId: Uuid,
    @SessionUser() session: ISessionWithUser,
  ): Promise<PostLikeDto> {
    return await this.postLikeService.createPostLike({
      postId,
      userId: session.userId,
    });
  }
}
