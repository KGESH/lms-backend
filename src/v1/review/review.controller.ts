import { Controller, UseGuards } from '@nestjs/common';
import {
  TypedBody,
  TypedException,
  TypedHeaders,
  TypedQuery,
  TypedRoute,
} from '@nestia/core';
import { ApiAuthHeaders, AuthHeaders } from '@src/v1/auth/auth.headers';
import {
  CreateReviewReplyDto,
  ReviewQuery,
  ReviewReplyWithSnapshotDto,
  ReviewWithRelationsDto,
} from '@src/v1/review/review.dto';
import {
  reviewReplyToDto,
  reviewToDto,
} from '@src/shared/helpers/transofrm/review';
import { ReviewReplyService } from '@src/v1/review/review-reply.service';
import { Roles } from '@src/core/decorators/roles.decorator';
import { RolesGuard } from '@src/core/guards/roles.guard';
import { TypeGuardError } from 'typia';
import { IErrorResponse } from '@src/shared/types/response';
import { SkipAuth } from '@src/core/decorators/skip-auth.decorator';
import { ReviewService } from '@src/v1/review/review.service';
import { withDefaultPagination } from '@src/core/pagination';
import { Paginated } from '@src/shared/types/pagination';
import { INVALID_LMS_SECRET } from '@src/core/error-code.constant';

@Controller('v1/review')
export class ReviewController {
  constructor(
    private readonly reviewService: ReviewService,
    private readonly reviewReplyService: ReviewReplyService,
  ) {}

  /**
   * 상품 리뷰 목록을 조회합니다.
   *
   * '강의 상품', '전자책 상품' 타입을 가리지 않고 모두 조회합니다.
   *
   * @tag review
   * @summary 상품 리뷰 목록 조회
   */
  @TypedRoute.Get('/')
  @SkipAuth()
  @TypedException<TypeGuardError>({
    status: 400,
    description: 'invalid request',
  })
  @TypedException<IErrorResponse<INVALID_LMS_SECRET>>({
    status: INVALID_LMS_SECRET,
    description: 'invalid LMS api secret',
  })
  async getEveryReviews(
    @TypedHeaders() headers: ApiAuthHeaders,
    @TypedQuery() query: ReviewQuery,
  ): Promise<Paginated<ReviewWithRelationsDto[]>> {
    const { totalCount, pagination, data } =
      await this.reviewService.findEveryProductReviews(
        { userId: query.userId },
        withDefaultPagination(query),
      );

    return {
      totalCount,
      pagination,
      data: data.map(reviewToDto),
    };
  }

  /**
   * 리뷰에 대한 답글을 생성합니다.
   *
   * @tag review
   * @summary 리뷰 답글 생성
   */
  @TypedRoute.Post('/reply')
  @Roles('admin', 'manager', 'teacher')
  @UseGuards(RolesGuard)
  @TypedException<TypeGuardError>({
    status: 400,
    description: 'invalid request',
  })
  @TypedException<IErrorResponse<403>>({
    status: 403,
    description: 'Not enough [role] to access this resource.',
  })
  @TypedException<IErrorResponse<404>>({
    status: 404,
    description: 'Reply user not found.',
  })
  @TypedException<IErrorResponse<INVALID_LMS_SECRET>>({
    status: INVALID_LMS_SECRET,
    description: 'invalid LMS api secret',
  })
  async createReviewReply(
    @TypedHeaders() headers: AuthHeaders,
    @TypedBody() body: CreateReviewReplyDto,
  ): Promise<ReviewReplyWithSnapshotDto> {
    const reply = await this.reviewReplyService.createReviewReply({
      replyCreateParams: {
        ...body,
      },
      snapshotCreateParams: {
        ...body,
      },
    });

    return reviewReplyToDto(reply);
  }
}
