import { Controller } from '@nestjs/common';
import { ReviewService } from '@src/v1/review/review.service';
import {
  TypedBody,
  TypedHeaders,
  TypedParam,
  TypedQuery,
  TypedRoute,
} from '@nestia/core';
import { SkipAuth } from '@src/core/decorators/skip-auth.decorator';
import { ApiAuthHeaders, AuthHeaders } from '@src/v1/auth/auth.headers';
import { ReviewQuery, ReviewWithRelationsDto } from '@src/v1/review/review.dto';
import { DEFAULT_PAGINATION } from '@src/core/pagination.constant';
import { reviewToDto } from '@src/shared/helpers/transofrm/review';
import { Uuid } from '@src/shared/types/primitive';
import { EbookReviewService } from '@src/v1/review/ebook-review/ebook-review.service';
import { CreateEbookReviewDto } from '@src/v1/review/ebook-review/ebook-review.dto';
import { ReviewReplyService } from '@src/v1/review/review-reply.service';

@Controller('v1/review/ebook')
export class EbookReviewController {
  constructor(
    private readonly reviewService: ReviewService,
    private readonly reviewReplyService: ReviewReplyService,
    private readonly ebookReviewService: EbookReviewService,
  ) {}

  /**
   * 전자책 리뷰 목록을 조회합니다.
   *
   * @tag review-ebook
   * @summary 전자책 리뷰 목록 조회
   */
  @TypedRoute.Get('/')
  @SkipAuth()
  async getEbookReviews(
    @TypedHeaders() headers: ApiAuthHeaders,
    @TypedQuery() query?: ReviewQuery,
  ): Promise<ReviewWithRelationsDto[]> {
    const reviews = await this.reviewService.findManyReviews(
      { productType: 'ebook' },
      { ...DEFAULT_PAGINATION, ...query },
    );

    return reviews.map(reviewToDto);
  }

  /**
   * 특정 전자책 리뷰 목록을 조회합니다.
   *
   * @tag review-ebook
   * @summary 특정 전자책 리뷰 목록 조회
   * @param ebookId - 조회할 전자책 id
   */
  @TypedRoute.Get('/:ebookId')
  @SkipAuth()
  async getEbookReviewsByEbookId(
    @TypedHeaders() headers: ApiAuthHeaders,
    @TypedParam('ebookId') ebookId: Uuid,
    @TypedQuery() query?: ReviewQuery,
  ): Promise<ReviewWithRelationsDto[]> {
    const reviews = await this.ebookReviewService.findEbookReviewsByEbookId(
      {
        ebookId,
      },
      {
        ...DEFAULT_PAGINATION,
        ...query,
      },
    );

    return reviews.map(reviewToDto);
  }

  /**
   * 전자책 리뷰를 생성합니다.
   *
   * @tag review-ebook
   * @summary 전자책 리뷰 생성
   */
  @TypedRoute.Post('/')
  async createEbookReview(
    @TypedHeaders() headers: AuthHeaders,
    @TypedBody() body: CreateEbookReviewDto,
  ): Promise<ReviewWithRelationsDto> {
    const review = await this.ebookReviewService.createEbookReviewWithSnapshot({
      ebookId: body.ebookId,
      reviewCreateParams: {
        ...body,
        productType: 'ebook',
      },
      snapshotCreateParams: {
        ...body,
      },
    });

    return reviewToDto(review);
  }
}
