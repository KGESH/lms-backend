import { Controller } from '@nestjs/common';
import { ReviewService } from '@src/v1/review/review.service';
import {
  TypedBody,
  TypedException,
  TypedHeaders,
  TypedParam,
  TypedQuery,
  TypedRoute,
} from '@nestia/core';
import { SkipAuth } from '@src/core/decorators/skip-auth.decorator';
import { ApiAuthHeaders, AuthHeaders } from '@src/v1/auth/auth.headers';
import {
  CreateReviewDto,
  DeleteReviewDto,
  ReviewQuery,
  ReviewWithRelationsDto,
  UpdateReviewDto,
} from '@src/v1/review/review.dto';
import { reviewToDto } from '@src/shared/helpers/transofrm/review';
import { Uuid } from '@src/shared/types/primitive';
import { EbookReviewService } from '@src/v1/review/ebook-review/ebook-review.service';
import { withDefaultPagination } from '@src/core/pagination';
import { SessionUser } from '@src/core/decorators/session-user.decorator';
import { ISessionWithUser } from '@src/v1/auth/session.interface';
import { TypeGuardError } from 'typia';
import { IErrorResponse } from '@src/shared/types/response';
import { INVALID_LMS_SECRET } from '@src/core/error-code.constant';

@Controller('v1/review/ebook')
export class EbookReviewController {
  constructor(
    private readonly reviewService: ReviewService,
    private readonly ebookReviewService: EbookReviewService,
  ) {}

  /**
   * 전자책 리뷰 목록을 조회합니다.
   *
   * Query parameter 'userId'를 통해 특정 사용자가 작성한 리뷰 목록를 조회할 수 있습니다.
   *
   * Query parameter 'userId'를 설정하면 0개 또는 N개의 리뷰가 배열에 담겨 반환됩니다.
   *
   * @tag review
   * @summary 전자책 리뷰 목록 조회
   */
  @TypedRoute.Get('/')
  @SkipAuth()
  async getEbookReviews(
    @TypedHeaders() headers: ApiAuthHeaders,
    @TypedQuery() query: ReviewQuery,
  ): Promise<ReviewWithRelationsDto[]> {
    const reviews = await this.reviewService.findManyReviews(
      {
        productType: 'ebook',
        userId: query.userId,
      },
      withDefaultPagination(query),
    );

    return reviews.map(reviewToDto);
  }

  /**
   * 특정 전자책 리뷰 목록을 조회합니다.
   *
   * Query parameter 'userId'를 통해 특정 사용자가 작성한 리뷰를 조회할 수 있습니다.
   *
   * Query parameter 'userId'를 설정하면 0개 또는 1개의 리뷰가 배열에 담겨 반환됩니다.
   *
   * @tag review
   * @summary 특정 전자책 리뷰 목록 조회
   * @param ebookId - 조회할 전자책 id
   */
  @TypedRoute.Get('/:ebookId')
  @SkipAuth()
  async getEbookReviewsByEbookId(
    @TypedHeaders() headers: ApiAuthHeaders,
    @TypedParam('ebookId') ebookId: Uuid,
    @TypedQuery() query: ReviewQuery,
  ): Promise<ReviewWithRelationsDto[]> {
    const reviews = await this.ebookReviewService.findEbookReviewsByEbookId(
      {
        ebookId,
        userId: query.userId,
      },
      withDefaultPagination(query),
    );

    return reviews.map(reviewToDto);
  }

  /**
   * 전자책 리뷰를 생성합니다.
   *
   * @tag review
   * @summary 전자책 리뷰 생성
   */
  @TypedRoute.Post('/:ebookId')
  async createEbookReview(
    @TypedHeaders() headers: AuthHeaders,
    @TypedParam('ebookId') ebookId: Uuid,
    @TypedBody() body: CreateReviewDto,
    @SessionUser() session: ISessionWithUser,
  ): Promise<ReviewWithRelationsDto> {
    const review = await this.ebookReviewService.createEbookReview({
      ...body,
      ebookId,
      userId: session.userId,
    });

    return reviewToDto(review);
  }

  /**
   * 전자책 리뷰를 수정합니다.
   *
   * @tag review
   * @summary 전자책 리뷰 수정
   */
  @TypedRoute.Patch('/:ebookId')
  @TypedException<TypeGuardError>({
    status: 400,
    description: 'invalid request',
  })
  @TypedException<IErrorResponse<404>>({
    status: 404,
    description: 'review not found',
  })
  @TypedException<IErrorResponse<INVALID_LMS_SECRET>>({
    status: INVALID_LMS_SECRET,
    description: 'invalid LMS api secret',
  })
  async updateEbookReview(
    @TypedHeaders() headers: AuthHeaders,
    @TypedParam('ebookId') ebookId: Uuid,
    @TypedBody() body: UpdateReviewDto,
    @SessionUser() session: ISessionWithUser,
  ): Promise<ReviewWithRelationsDto> {
    const review = await this.ebookReviewService.updateEbookReview(
      session.user,
      { id: body.reviewId, productType: 'ebook' },
      body,
    );

    return reviewToDto(review);
  }

  /**
   * 전자책 리뷰를 삭제합니다.
   *
   * @tag review
   * @summary 전자책 리뷰 삭제
   */
  @TypedRoute.Delete('/:ebookId')
  @TypedException<TypeGuardError>({
    status: 400,
    description: 'invalid request',
  })
  @TypedException<IErrorResponse<404>>({
    status: 404,
    description: 'review not found',
  })
  @TypedException<IErrorResponse<INVALID_LMS_SECRET>>({
    status: INVALID_LMS_SECRET,
    description: 'invalid LMS api secret',
  })
  async deleteEbookReview(
    @TypedHeaders() headers: AuthHeaders,
    @TypedParam('ebookId') ebookId: Uuid,
    @TypedBody() body: DeleteReviewDto,
    @SessionUser() session: ISessionWithUser,
  ): Promise<DeleteReviewDto> {
    const deleted = await this.ebookReviewService.deleteEbookReview(
      session.user,
      {
        id: body.reviewId,
        productType: 'ebook',
      },
    );

    return { reviewId: deleted.id };
  }
}
