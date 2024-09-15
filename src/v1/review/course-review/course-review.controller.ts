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
import { reviewToDto } from '@src/shared/helpers/transofrm/review';
import { Uuid } from '@src/shared/types/primitive';
import { CreateCourseReviewDto } from '@src/v1/review/course-review/course-review.dto';
import { CourseReviewService } from '@src/v1/review/course-review/course-review.service';
import { withDefaultPagination } from '@src/core/pagination';
import { SessionUser } from '@src/core/decorators/session-user.decorator';
import { ISessionWithUser } from '@src/v1/auth/session.interface';

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
  @TypedRoute.Post('/')
  async createCourseReview(
    @TypedHeaders() headers: AuthHeaders,
    @TypedBody() body: CreateCourseReviewDto,
    @SessionUser() session: ISessionWithUser,
  ): Promise<ReviewWithRelationsDto> {
    const review = await this.courseReviewService.createCourseReview(
      session.user,
      body,
    );

    return reviewToDto(review);
  }
}
