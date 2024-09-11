import { Controller, UseGuards } from '@nestjs/common';
import {
  TypedBody,
  TypedException,
  TypedHeaders,
  TypedParam,
  TypedQuery,
  TypedRoute,
} from '@nestia/core';
import {
  CreatePostDto,
  PostCommentQuery,
  PostDto,
  PostQuery,
  UpdatePostDto,
} from '@src/v1/post/post.dto';
import { PostRelationsService } from '@src/v1/post/post-relations.service';
import {
  PostRelationsDto,
  PostWithCommentsDto,
} from '@src/v1/post/post-relations.dto';
import { AuthHeaders, GuestAuthHeaders } from '@src/v1/auth/auth.headers';
import { Uuid } from '@src/shared/types/primitive';
import { TypeGuardError } from 'typia';
import { SessionUser } from '@src/core/decorators/session-user.decorator';
import { ISessionWithUser } from '@src/v1/auth/session.interface';
import { IErrorResponse } from '@src/shared/types/response';
import {
  postToPostWithCommentCountDto,
  postToPostWithCommentsDto,
} from '@src/shared/helpers/transofrm/post';
import { Paginated } from '@src/shared/types/pagination';
import { withDefaultPagination } from '@src/core/pagination';
import { PostCategoryAccessGuard } from '@src/core/guards/post-category-access.guard';
import { GuestAccess } from '@src/core/decorators/guest-access.decorator';

@Controller('v1/post')
export class PostRelationsController {
  constructor(private readonly postRelationsService: PostRelationsService) {}

  /**
   * 카테고리를 기준으로 게시글 목록을 조회합니다.
   *
   * 로그인 없이 조회할 수 있습니다.
   *
   * Query parameter 'categoryId' 속성을 설정해야합니다.
   *
   * Query parameter 'displayName'을 통해 작성자 닉네임으로 필터링할 수 있습니다.
   *
   * Query parameter 'title'을 통해 게시글 제목으로 필터링할 수 있습니다.
   *
   * Query parameter 'content'을 통해 게시글 내용으로 필터링할 수 있습니다.
   *
   * Query parameter 'title'과 'content'를 동시에 설정하면 OR 조건으로  필터링됩니다. (제목 + 내용)
   *
   * 댓글 목록은 제공하지 않습니다.
   *
   * 댓글 count만 제공합니다.
   *
   * @tag post
   * @summary 게시글 목록 조회 (public)
   */
  @TypedRoute.Get('/')
  @GuestAccess()
  @UseGuards(PostCategoryAccessGuard)
  @TypedException<TypeGuardError>({
    status: 400,
    description: 'invalid request',
  })
  @TypedException<IErrorResponse<404>>({
    status: 404,
    description: 'post category not found',
  })
  async getPostsByCategory(
    @TypedHeaders() headers: GuestAuthHeaders,
    @TypedQuery() query: PostQuery,
  ): Promise<Paginated<PostRelationsDto[]>> {
    const { data: posts, ...paginated } =
      await this.postRelationsService.findPostsByCategory(
        query,
        withDefaultPagination(query),
      );

    return {
      ...paginated,
      data: posts.map(postToPostWithCommentCountDto),
    };
  }

  /**
   * 특정 게시글을 조회합니다.
   *
   * 로그인 없이 조회할 수 있습니다.
   *
   * 댓글 목록을 제공합니다.
   *
   * Query parameter의 pagination 속성들로 초기 로딩 댓글 목록을 페이징할 수 있습니다.
   *
   * Query parameter의 pagination을 빈 객체({})로 설정하면 default 페이징이 적용됩니다. (pageSize: 10, page: 1, order: 'desc')
   *
   * 초기 로딩 이후 추가 댓글 목록을 불러오기 위해서는 댓글 목록 조회 API를 사용해야합니다.
   *
   * @tag post
   * @summary 특정 게시글 조회 (public)
   */
  @TypedRoute.Get('/:id')
  @GuestAccess()
  @UseGuards(PostCategoryAccessGuard)
  @TypedException<TypeGuardError>({
    status: 400,
    description: 'invalid request',
  })
  async getPostById(
    @TypedHeaders() headers: GuestAuthHeaders,
    @TypedParam('id') id: Uuid,
    @TypedQuery() query: PostCommentQuery,
  ): Promise<PostWithCommentsDto | null> {
    const post = await this.postRelationsService.findPostWithComments(
      { id },
      {
        commentPagination: withDefaultPagination(query),
      },
    );

    if (!post) {
      return null;
    }

    if (query.incrementViewCount) {
      await this.postRelationsService.incrementPostViewCount(post);
    }

    return postToPostWithCommentsDto(post);
  }

  /**
   * 게시글을 생성합니다.
   *
   * @tag post
   * @summary 게시글 생성
   */
  @TypedRoute.Post('/')
  @UseGuards(PostCategoryAccessGuard)
  @TypedException<TypeGuardError>({
    status: 400,
    description: 'invalid request',
  })
  @TypedException<IErrorResponse<404>>({
    status: 404,
    description: 'post category not found',
  })
  async createPost(
    @TypedHeaders() headers: AuthHeaders,
    @TypedBody() body: CreatePostDto,
    @SessionUser() session: ISessionWithUser,
  ): Promise<PostWithCommentsDto> {
    const { snapshot, ...post } = await this.postRelationsService.createPost({
      postCreateParams: {
        ...body,
        userId: session.userId,
      },
      snapshotCreateParams: {
        ...body,
      },
    });

    return {
      ...post,
      author: session.user,
      title: snapshot.title,
      content: snapshot.content,
      commentCount: 0,
      comments: [],
    };
  }

  /**
   * 게시글을 수정합니다.
   *
   * @tag post
   * @summary 게시글 수정
   */
  @TypedRoute.Patch('/:id')
  @UseGuards(PostCategoryAccessGuard)
  @TypedException<TypeGuardError>({
    status: 400,
    description: 'invalid request',
  })
  @TypedException<IErrorResponse<404>>({
    status: 404,
    description: 'post category not found',
  })
  async updatePost(
    @TypedHeaders() headers: AuthHeaders,
    @TypedParam('id') id: Uuid,
    @TypedBody() body: UpdatePostDto,
  ): Promise<PostWithCommentsDto> {
    const updatedPost = await this.postRelationsService.updatePostContent({
      postId: id,
      ...body,
    });

    return postToPostWithCommentsDto(updatedPost);
  }

  /**
   * 게시글을 삭제합니다.
   *
   * Soft delete로 구현되어 있습니다.
   *
   * @tag post
   * @summary 게시글 삭제
   */
  @TypedRoute.Delete('/:id')
  @UseGuards(PostCategoryAccessGuard)
  @TypedException<TypeGuardError>({
    status: 400,
    description: 'invalid request',
  })
  @TypedException<IErrorResponse<404>>({
    status: 404,
    description: 'post not found',
  })
  async deletePost(
    @TypedHeaders() headers: AuthHeaders,
    @TypedParam('id') id: Uuid,
  ): Promise<Pick<PostDto, 'id'>> {
    return await this.postRelationsService.deletePost({ id });
  }
}
