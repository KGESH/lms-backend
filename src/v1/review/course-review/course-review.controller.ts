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
  DeleteReviewDto,
  ReviewQuery,
  ReviewWithRelationsDto,
} from '@src/v1/review/review.dto';
import { reviewToDto } from '@src/shared/helpers/transofrm/review';
import { Uuid } from '@src/shared/types/primitive';
import {
  CreateCourseReviewDto,
  UpdateCourseReviewDto,
} from '@src/v1/review/course-review/course-review.dto';
import { CourseReviewService } from '@src/v1/review/course-review/course-review.service';
import { withDefaultPagination } from '@src/core/pagination';
import { SessionUser } from '@src/core/decorators/session-user.decorator';
import { ISessionWithUser } from '@src/v1/auth/session.interface';
import { TypeGuardError } from 'typia';
import { IErrorResponse } from '@src/shared/types/response';
import { INVALID_LMS_SECRET } from '@src/core/error-code.constant';

@Controller('v1/review/course')
export class CourseReviewController {
  constructor(
    private readonly reviewService: ReviewService,
    private readonly courseReviewService: CourseReviewService,
  ) {}

  /**
   * 강의 리뷰 목록을 조회합니다.
   *
   * Query parameter 'userId'를 통해 특정 사용자가 작성한 리뷰 목록를 조회할 수 있습니다.
   *
   * Query parameter 'userId'를 설정하면 0개 또는 N개의 리뷰가 배열에 담겨 반환됩니다.
   *
   * @tag review
   * @summary 강의 리뷰 목록 조회
   */
  @TypedRoute.Get('/')
  @SkipAuth()
  async getCourseReviews(
    @TypedHeaders() headers: ApiAuthHeaders,
    @TypedQuery() query: ReviewQuery,
  ): Promise<ReviewWithRelationsDto[]> {
    const reviews = await this.reviewService.findManyReviews(
      {
        productType: 'course',
        userId: query.userId,
      },
      withDefaultPagination(query),
    );

    return reviews.map(reviewToDto);
  }

  /**
   * 특정 강의 리뷰 목록을 조회합니다.
   *
   * Query parameter 'userId'를 통해 특정 사용자가 작성한 리뷰를 조회할 수 있습니다.
   *
   * Query parameter 'userId'를 설정하면 0개 또는 1개의 리뷰가 배열에 담겨 반환됩니다.
   *
   * @tag review
   * @summary 특정 강의 리뷰 목록 조회
   * @param courseId - 조회할 강의 id
   */
  @TypedRoute.Get('/:courseId')
  @SkipAuth()
  async getCourseReviewsByCourseId(
    @TypedHeaders() headers: ApiAuthHeaders,
    @TypedParam('courseId') courseId: Uuid,
    @TypedQuery() query: ReviewQuery,
  ): Promise<ReviewWithRelationsDto[]> {
    const reviews = await this.courseReviewService.findCourseReviewsByCourseId(
      {
        courseId,
        userId: query.userId,
      },
      withDefaultPagination(query),
    );

    return reviews.map(reviewToDto);
  }

  /**
   * 강의 리뷰를 생성합니다.
   *
   * @tag review
   * @summary 강의 리뷰 생성
   */
  @TypedException<TypeGuardError>({
    status: 400,
    description: 'invalid request',
  })
  @TypedException<IErrorResponse<INVALID_LMS_SECRET>>({
    status: INVALID_LMS_SECRET,
    description: 'invalid LMS api secret',
  })
  @TypedRoute.Post('/:courseId')
  async createCourseReview(
    @TypedHeaders() headers: AuthHeaders,
    @TypedParam('courseId') courseId: Uuid,
    @TypedBody() body: CreateCourseReviewDto,
    @SessionUser() session: ISessionWithUser,
  ): Promise<ReviewWithRelationsDto> {
    const review = await this.courseReviewService.createCourseReview(
      session.user,
      { ...body, courseId },
    );

    return reviewToDto(review);
  }

  /**
   * 강의 리뷰를 수정합니다.
   *
   * @tag review
   * @summary 강의 리뷰 수정
   */
  @TypedRoute.Patch('/:courseId')
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
  async updateCourseReview(
    @TypedHeaders() headers: AuthHeaders,
    @TypedParam('courseId') courseId: Uuid,
    @TypedBody() body: UpdateCourseReviewDto,
    @SessionUser() session: ISessionWithUser,
  ): Promise<ReviewWithRelationsDto> {
    const review = await this.courseReviewService.updateCourseReview(
      session.user,
      { id: body.reviewId, productType: 'course' },
      body,
    );

    return reviewToDto(review);
  }

  /**
   * 강의 리뷰를 삭제합니다.
   *
   * @tag review
   * @summary 강의 리뷰 삭제
   */
  @TypedRoute.Delete('/:courseId')
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
  async deleteCourseReview(
    @TypedHeaders() headers: AuthHeaders,
    @TypedParam('courseId') courseId: Uuid,
    @TypedBody() body: DeleteReviewDto,
    @SessionUser() session: ISessionWithUser,
  ): Promise<DeleteReviewDto> {
    const deleted = await this.courseReviewService.deleteCourseReview(
      session.user,
      {
        id: body.reviewId,
        productType: 'course',
      },
    );

    return { reviewId: deleted.id };
  }
}
