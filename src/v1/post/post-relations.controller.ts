import { Controller } from '@nestjs/common';
import {
  TypedBody,
  TypedException,
  TypedHeaders,
  TypedParam,
  TypedQuery,
  TypedRoute,
} from '@nestia/core';
import { CreatePostDto, PostQuery, UpdatePostDto } from '@src/v1/post/post.dto';
import { PostRelationsService } from '@src/v1/post/post-relations.service';
import {
  PostWithCommentCountDto,
  PostWithCommentsDto,
} from '@src/v1/post/post-relations.dto';
import { ApiAuthHeaders, AuthHeaders } from '@src/v1/auth/auth.headers';
import { SkipAuth } from '@src/core/decorators/skip-auth.decorator';
import { DEFAULT_PAGINATION } from '@src/core/pagination.constant';
import { Uuid } from '@src/shared/types/primitive';
import { TypeGuardError } from 'typia';
import { SessionUser } from '@src/core/decorators/session-user.decorator';
import { ISessionWithUser } from '@src/v1/auth/session.interface';
import { IErrorResponse } from '@src/shared/types/response';
import {
  postToPostWithCommentCountDto,
  postToPostWithCommentsDto,
} from '@src/shared/helpers/transofrm/post';

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
   * 게시글 본문은 제공하지 않습니다.
   *
   * @tag post
   * @summary 게시글 목록 조회 (public)
   */
  @TypedRoute.Get('/')
  @SkipAuth()
  @TypedException<TypeGuardError>({
    status: 400,
    description: 'invalid request',
  })
  @TypedException<IErrorResponse<404>>({
    status: 404,
    description: 'post category not found',
  })
  async getPostsByCategory(
    @TypedHeaders() headers: ApiAuthHeaders,
    @TypedQuery() query: PostQuery,
  ): Promise<PostWithCommentCountDto[]> {
    const posts = await this.postRelationsService.findPostsByCategory(
      {
        categoryId: query.categoryId,
      },
      {
        ...DEFAULT_PAGINATION,
        ...query,
      },
    );

    return posts.map(postToPostWithCommentCountDto);
  }

  @TypedRoute.Get('/:id')
  @SkipAuth()
  @TypedException<TypeGuardError>({
    status: 400,
    description: 'invalid request',
  })
  async getPostById(
    @TypedHeaders() headers: ApiAuthHeaders,
    @TypedParam('id') id: Uuid,
  ): Promise<PostWithCommentsDto | null> {
    const post = await this.postRelationsService.findPostWithComments(
      { id },
      { commentPagination: DEFAULT_PAGINATION },
    );

    if (!post) {
      return null;
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
      comments: [],
    };
  }

  @TypedRoute.Patch('/:id')
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
}
