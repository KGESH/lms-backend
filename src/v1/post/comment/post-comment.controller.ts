import { Controller } from '@nestjs/common';
import { PostCommentService } from '@src/v1/post/comment/post-comment.service';
import {
  TypedBody,
  TypedException,
  TypedHeaders,
  TypedParam,
  TypedQuery,
  TypedRoute,
} from '@nestia/core';
import { Uuid } from '@src/shared/types/primitive';
import { SkipAuth } from '@src/core/decorators/skip-auth.decorator';
import { ApiAuthHeaders, AuthHeaders } from '@src/v1/auth/auth.headers';
import { PostCommentQuery } from '@src/v1/post/post.dto';
import { DEFAULT_PAGINATION } from '@src/core/pagination.constant';
import {
  CreatePostCommentDto,
  PostCommentDto,
  PostCommentWithChildrenDto,
  UpdatePostCommentDto,
} from '@src/v1/post/comment/post-comment.dto';
import { SessionUser } from '@src/core/decorators/session-user.decorator';
import { ISessionWithUser } from '@src/v1/auth/session.interface';
import { postCommentWithChildrenToDto } from '@src/shared/helpers/transofrm/post-comment';
import { IErrorResponse } from '@src/shared/types/response';
import { TypeGuardError } from 'typia';
import { withDefaultPagination } from '@src/core/pagination';

@Controller('v1/post/:postId/comment')
export class PostCommentController {
  constructor(private readonly postCommentService: PostCommentService) {}

  /**
   *
   * [Deprecated] Post API에서 댓글을 함께 조회할 수 있도록 변경되었습니다.
   *
   * 이 엔드포인트는 더 이상 사용되지 않습니다.
   *
   * 특정 게시글의 댓글 목록을 조회합니다.
   *
   * 로그인 없이 조회할 수 있습니다.
   *
   * Query parameter의 페이지네이션 속성은 부모 댓글 목록의 수에 영향을 줍니다.
   *
   * 대댓글(children)의 페이지네이션 속성은 고정입니다. (count: 10, orderBy: ['createdAt', 'asc'])
   *
   * 대댓글을 더 조회하려면 부모 댓글(parent)의 id로 'post/:postId/comment/:id' 엔드포인트를 요청합니다.
   *
   * @tag post-comment
   * @summary 댓글 목록 조회 (public)
   * @param postId - 댓글이 속한 게시글의 id
   * @deprecated
   */
  @TypedRoute.Get('/')
  @SkipAuth()
  @TypedException<TypeGuardError>({
    status: 400,
    description: 'invalid request',
  })
  @TypedException<IErrorResponse<404>>({
    status: 404,
    description: 'post not found',
  })
  async getPostRootComments(
    @TypedHeaders() headers: ApiAuthHeaders,
    @TypedParam('postId') postId: Uuid,
    @TypedQuery() query: PostCommentQuery,
  ): Promise<PostCommentWithChildrenDto[]> {
    const comments = await this.postCommentService.findPostRootComments(
      { postId },
      {
        parentPagination: withDefaultPagination(query),
        childrenPagination: {
          pageSize: DEFAULT_PAGINATION.pageSize,
          orderBy: 'asc',
        },
      },
    );

    return comments.map(postCommentWithChildrenToDto);
  }

  /**
   * 특정 댓글을 조회합니다.
   *
   * 로그인 없이 조회할 수 있습니다.
   *
   * 모든 대댓글(children)도 함께 조회합니다.
   *
   * @tag post-comment
   * @summary 특정 댓글 조회 (public)
   * @param postId - 댓글이 속한 게시글의 id
   * @param id - 조회할 댓글의 id
   */
  @TypedRoute.Get('/:id')
  @SkipAuth()
  @TypedException<TypeGuardError>({
    status: 400,
    description: 'invalid request',
  })
  async getPostCommentWithChildren(
    @TypedHeaders() headers: ApiAuthHeaders,
    @TypedParam('postId') postId: Uuid,
    @TypedParam('id') id: Uuid,
  ): Promise<PostCommentWithChildrenDto | null> {
    const comment = await this.postCommentService.findPostCommentWithChildren({
      id,
    });

    if (!comment) {
      return null;
    }

    return postCommentWithChildrenToDto(comment);
  }

  /**
   * 댓글을 생성합니다.
   *
   * @tag post-comment
   * @summary 댓글 생성
   * @param postId - 댓글을 생성할 게시글의 id
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
  async createPostComment(
    @TypedHeaders() headers: AuthHeaders,
    @TypedParam('postId') postId: Uuid,
    @TypedBody() body: CreatePostCommentDto,
    @SessionUser() session: ISessionWithUser,
  ): Promise<PostCommentWithChildrenDto> {
    const comment = await this.postCommentService.createPostComment({
      createParams: {
        postId,
        userId: session.userId,
        ...body,
      },
      snapshotCreateParams: { ...body },
    });

    return postCommentWithChildrenToDto({
      ...comment,
      children: [],
      user: session.user,
    });
  }

  /**
   * 댓글을 수정합니다.
   *
   * 매니저, 어드민 이외의 사용자가 타인의 댓글 수정을 시도할 경우 403 예외를 반환합니다.
   *
   * @tag post-comment
   * @summary 댓글 수정
   * @param postId - 댓글이 속한 게시글의 id
   * @param id - 수정할 댓글의 id
   */
  @TypedRoute.Patch('/:id')
  @TypedException<TypeGuardError>({
    status: 400,
    description: 'invalid request',
  })
  @TypedException<IErrorResponse<403>>({
    status: 403,
    description: 'you are not allowed to update this comment',
  })
  @TypedException<IErrorResponse<404>>({
    status: 404,
    description: 'post comment not found',
  })
  async updatePostComment(
    @TypedHeaders() headers: AuthHeaders,
    @TypedParam('postId') postId: Uuid,
    @TypedParam('id') id: Uuid,
    @TypedBody() body: UpdatePostCommentDto,
    @SessionUser() session: ISessionWithUser,
  ): Promise<PostCommentWithChildrenDto> {
    const comment = await this.postCommentService.updatePostComment(
      session.user,
      {
        commentId: id,
        ...body,
      },
    );

    return postCommentWithChildrenToDto(comment);
  }

  /**
   * 댓글을 삭제합니다.
   *
   * Soft delete로 구현되어 있습니다.
   *
   * 매니저, 어드민 이외의 사용자가 타인의 댓글 삭제를 시도할 경우 403 예외를 반환합니다.
   *
   * @tag post-comment
   * @summary 댓글 수정
   * @param postId - 댓글이 속한 게시글의 id
   * @param id - 수정할 댓글의 id
   */
  @TypedRoute.Delete('/:id')
  @TypedException<TypeGuardError>({
    status: 400,
    description: 'invalid request',
  })
  @TypedException<IErrorResponse<403>>({
    status: 403,
    description: 'you are not allowed to delete this comment',
  })
  @TypedException<IErrorResponse<404>>({
    status: 404,
    description: 'post comment not found',
  })
  async deletePostComment(
    @TypedHeaders() headers: AuthHeaders,
    @TypedParam('postId') postId: Uuid,
    @TypedParam('id') id: Uuid,
    @SessionUser() session: ISessionWithUser,
  ): Promise<Pick<PostCommentDto, 'id'>> {
    const deleted = await this.postCommentService.deletePostComment(
      session.user,
      { id },
    );

    return deleted;
  }
}
