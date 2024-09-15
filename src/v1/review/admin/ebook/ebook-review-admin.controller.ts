import { Controller, UseGuards } from '@nestjs/common';
import {
  TypedBody,
  TypedException,
  TypedHeaders,
  TypedParam,
  TypedQuery,
  TypedRoute,
} from '@nestia/core';
import { ApiAuthHeaders, AuthHeaders } from '@src/v1/auth/auth.headers';
import { SessionUser } from '@src/core/decorators/session-user.decorator';
import { ISessionWithUser } from '@src/v1/auth/session.interface';
import { ReviewWithRelationsDto } from '@src/v1/review/review.dto';
import { reviewToDto } from '@src/shared/helpers/transofrm/review';
import { EbookReviewAdminService } from '@src/v1/review/admin/ebook/ebook-review-admin.service';
import {
  CreateMockReviewDto,
  MockEbookReviewQuery,
} from '@src/v1/review/mock-review/mock-review.dto';
import { Roles } from '@src/core/decorators/roles.decorator';
import { RolesGuard } from '@src/core/guards/roles.guard';
import { TypeGuardError } from 'typia';
import { IErrorResponse } from '@src/shared/types/response';
import { Uuid } from '@src/shared/types/primitive';
import { INVALID_LMS_SECRET } from '@src/core/error-code.constant';
import { SkipAuth } from '@src/core/decorators/skip-auth.decorator';
import { withDefaultPagination } from '@src/core/pagination';

@Controller('v1/review/admin/ebook')
export class EbookReviewAdminController {
  constructor(
    private readonly ebookReviewAdminService: EbookReviewAdminService,
  ) {}

  /**
   * 강의 mock 리뷰 목록을 조회합니다.
   *
   * Query parameter 'ebookId'을 통해 강의를 필터링할 수 있습니다.
   *
   * @tag mock-review
   * @summary 강의 mock 리뷰 목록 조회
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
  async getMockEbookReviews(
    @TypedHeaders() headers: ApiAuthHeaders,
    @TypedQuery() query: MockEbookReviewQuery,
  ): Promise<ReviewWithRelationsDto[]> {
    const mockEbookReviews =
      await this.ebookReviewAdminService.getMockEbookReviews(
        query,
        withDefaultPagination(query),
      );

    return mockEbookReviews.map(reviewToDto);
  }

  /**
   * 전자책 mock 리뷰를 생성합니다.
   *
   * @tag mock-review
   * @summary 전자책 mock 리뷰 생성
   */
  @TypedRoute.Post('/:ebookId')
  @Roles('admin', 'manager')
  @UseGuards(RolesGuard)
  @TypedException<TypeGuardError>({
    status: 400,
    description: 'invalid request',
  })
  @TypedException<IErrorResponse<403>>({
    status: 403,
    description: 'Not enough [role] to access this resource.',
  })
  @TypedException<IErrorResponse<INVALID_LMS_SECRET>>({
    status: INVALID_LMS_SECRET,
    description: 'invalid LMS api secret',
  })
  async createMockEbookReview(
    @TypedHeaders() headers: AuthHeaders,
    @TypedParam('ebookId') ebookId: Uuid,
    @TypedBody() body: CreateMockReviewDto,
    @SessionUser() session: ISessionWithUser,
  ): Promise<ReviewWithRelationsDto> {
    const review = await this.ebookReviewAdminService.createEbookReviewByAdmin(
      ebookId,
      {
        reviewCreateParams: {
          userId: session.userId,
          orderId: null,
          productType: 'ebook',
        },
        reviewSnapshotCreateParams: body.mockReviewCreateParams,
        mockUserCreateParams: body.mockUserCreateParams,
      },
    );

    return reviewToDto(review);
  }
}
