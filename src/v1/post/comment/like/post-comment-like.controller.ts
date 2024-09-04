import { Controller } from '@nestjs/common';
import {
  TypedException,
  TypedHeaders,
  TypedParam,
  TypedRoute,
} from '@nestia/core';
import { AuthHeaders } from '@src/v1/auth/auth.headers';
import { Uuid } from '@src/shared/types/primitive';
import { TypeGuardError } from 'typia';
import { IErrorResponse } from '@src/shared/types/response';
import { PostCommentLikeService } from '@src/v1/post/comment/like/post-comment-like.service';
import { PostCommentLikeDto } from '@src/v1/post/comment/like/post-comment-like.dto';
import { SessionUser } from '@src/core/decorators/session-user.decorator';
import { ISessionWithUser } from '@src/v1/auth/session.interface';

@Controller('v1/post/:postId/comment/:commentId/like')
export class PostCommentLikeController {
  constructor(
    private readonly postCommentLikeService: PostCommentLikeService,
  ) {}

  /**
   * 댓글에 대한 '좋아요'를 생성합니다.
   *
   * 이미 '좋아요'한 사용자는 중복해서 '좋아요'를 생성할 수 없습니다.
   *
   * @tag post-comment-like
   * @summary 댓글 '좋아요' 생성
   * @param postId - 게시글 ID
   * @param commentId - 댓글 ID
   */
  @TypedRoute.Post('/')
  @TypedException<TypeGuardError>({
    status: 400,
    description: 'invalid request',
  })
  @TypedException<IErrorResponse<404>>({
    status: 404,
    description: 'comment not found',
  })
  @TypedException<IErrorResponse<409>>({
    status: 409,
    description: 'already liked',
  })
  async createPostCommentLike(
    @TypedHeaders() headers: AuthHeaders,
    @TypedParam('postId') postId: Uuid,
    @TypedParam('commentId') commentId: Uuid,
    @SessionUser() session: ISessionWithUser,
  ): Promise<PostCommentLikeDto> {
    return await this.postCommentLikeService.createPostCommentLike({
      commentId,
      userId: session.userId,
    });
  }
}
