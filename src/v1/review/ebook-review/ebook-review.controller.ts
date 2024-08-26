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
import { CreateEbookReviewDto } from '@src/v1/review/ebook-review/ebook-review.dto';

@Controller('v1/review/ebook')
export class EbookReviewController {
  constructor(private readonly reviewService: ReviewService) {}

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
    @TypedQuery() query: ReviewQuery,
  ): Promise<ReviewWithRelationsDto[]> {
    const reviews = await this.reviewService.findManyReviews(
      { productType: 'ebook' },
      { ...DEFAULT_PAGINATION, ...query },
    );

    return reviews.map(reviewToDto);
  }

  /**
   * 특정 전자책 리뷰를 조회합니다.
   *
   * @tag review-ebook
   * @summary 특정 전자책 리뷰 조회
   * @param id - 조회할 리뷰의 id
   */
  @TypedRoute.Get('/:id')
  @SkipAuth()
  async getEbookReview(
    @TypedHeaders() headers: ApiAuthHeaders,
    @TypedParam('id') id: Uuid,
  ): Promise<ReviewWithRelationsDto | null> {
    const review = await this.reviewService.findOneById({ id });

    if (!review) {
      return null;
    }

    return reviewToDto(review);
  }

  /**
   * 전자책 리뷰를 생성합니다.
   *
   * @tag review-ebook
   * @summary 전자책 리뷰 생성
   */
  // @TypedRoute.Post('/')
  // async createEbookReview(
  //   @TypedHeaders() headers: AuthHeaders,
  //   @TypedBody() body: CreateEbookReviewDto,
  // ): Promise<ReviewWithRelationsDto> {
  //   const review = await this.reviewService.createEbookReview({
  //     ebookId: body.ebookId,
  //     reviewCreateParams: {
  //       ...body,
  //       productType: 'ebook',
  //     },
  //     snapshotCreateParams: {
  //       ...body,
  //     },
  //   });
  //
  //   return reviewToDto(review);
  // }
}
