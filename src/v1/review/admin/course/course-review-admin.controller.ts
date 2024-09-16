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
import { CourseReviewAdminService } from '@src/v1/review/admin/course/course-review-admin.service';
import {
  CreateMockReviewDto,
  DeleteMockReviewDto,
  MockCourseReviewQuery,
  UpdateMockReviewDto,
} from '@src/v1/review/mock-review/mock-review.dto';
import { Roles } from '@src/core/decorators/roles.decorator';
import { RolesGuard } from '@src/core/guards/roles.guard';
import { TypeGuardError } from 'typia';
import { IErrorResponse } from '@src/shared/types/response';
import { Uuid } from '@src/shared/types/primitive';
import { INVALID_LMS_SECRET } from '@src/core/error-code.constant';
import { SkipAuth } from '@src/core/decorators/skip-auth.decorator';
import { withDefaultPagination } from '@src/core/pagination';

@Controller('v1/review/admin/course')
export class CourseReviewAdminController {
  constructor(
    private readonly courseReviewAdminService: CourseReviewAdminService,
  ) {}

  /**
   * 강의 mock 리뷰 목록을 조회합니다.
   *
   * 관리자 세션 id를 헤더에 담아서 요청합니다.
   *
   * Query parameter 'courseId'을 통해 강의를 필터링할 수 있습니다.
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
  async getMockCourseReviews(
    @TypedHeaders() headers: ApiAuthHeaders,
    @TypedQuery() query: MockCourseReviewQuery,
  ): Promise<ReviewWithRelationsDto[]> {
    const mockCourseReviews =
      await this.courseReviewAdminService.getMockCourseReviews(
        query,
        withDefaultPagination(query),
      );

    return mockCourseReviews.map(reviewToDto);
  }

  /**
   * 강의 mock 리뷰를 생성합니다.
   *
   * 관리자 세션 id를 헤더에 담아서 요청합니다.
   *
   * @tag mock-review
   * @summary 강의 mock 리뷰 생성
   */
  @TypedRoute.Post('/:courseId')
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
  async createMockCourseReview(
    @TypedHeaders() headers: AuthHeaders,
    @TypedParam('courseId') courseId: Uuid,
    @TypedBody() body: CreateMockReviewDto,
    @SessionUser() session: ISessionWithUser,
  ): Promise<ReviewWithRelationsDto> {
    const review =
      await this.courseReviewAdminService.createCourseReviewByAdmin(courseId, {
        reviewCreateParams: {
          userId: session.userId,
          orderId: null,
          productType: 'course',
        },
        reviewSnapshotCreateParams: body.mockReviewCreateParams,
        mockUserCreateParams: body.mockUserCreateParams,
      });

    return reviewToDto(review);
  }

  /**
   * 강의 mock 리뷰를 수정합니다.
   *
   * 관리자 세션 id를 헤더에 담아서 요청합니다.
   *
   * @tag mock-review
   * @summary 강의 mock 리뷰 수정
   */
  @TypedRoute.Patch('/:courseId')
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
  async updateMockCourseReview(
    @TypedHeaders() headers: AuthHeaders,
    @TypedParam('courseId') courseId: Uuid,
    @TypedBody() body: UpdateMockReviewDto,
  ): Promise<ReviewWithRelationsDto> {
    const updated =
      await this.courseReviewAdminService.updateCourseReviewByAdmin({
        reviewId: body.reviewId,
        mockUserCreateParams: body.mockUserCreateParams,
        reviewSnapshotUpdateParams: body.mockReviewCreateParams,
      });

    return reviewToDto(updated);
  }

  /**
   * 강의 mock 리뷰를 삭제합니다.
   *
   * 관리자 세션 id를 헤더에 담아서 요청합니다.
   *
   * Hard delete로 구현되어 있습니다.
   *
   * 삭제 성공시 삭제된 리뷰 ID를 반환합니다.
   *
   * 관련된 댓글, 스냅샷, mock user도 함께 삭제됩니다.
   *
   * @tag mock-review
   * @summary 강의 mock 리뷰 수정
   */
  @TypedRoute.Delete('/:courseId')
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
  async deleteMockCourseReview(
    @TypedHeaders() headers: AuthHeaders,
    @TypedParam('courseId') courseId: Uuid,
    @TypedBody() body: DeleteMockReviewDto,
  ): Promise<DeleteMockReviewDto> {
    const deletedReviewId =
      await this.courseReviewAdminService.deleteCourseReviewByAdmin(
        body.reviewId,
      );

    return { reviewId: deletedReviewId };
  }
}
