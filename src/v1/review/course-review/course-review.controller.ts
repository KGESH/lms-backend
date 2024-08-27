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
import { CreateCourseReviewDto } from '@src/v1/review/course-review/course-review.dto';
import { CourseReviewService } from '@src/v1/review/course-review/course-review.service';

@Controller('v1/review/course')
export class CourseReviewController {
  constructor(
    private readonly reviewService: ReviewService,
    private readonly courseReviewService: CourseReviewService,
  ) {}

  /**
   * 강의 리뷰 목록을 조회합니다.
   *
   * @tag review-course
   * @summary 강의 리뷰 목록 조회
   */
  @TypedRoute.Get('/')
  @SkipAuth()
  async getCourseReviews(
    @TypedHeaders() headers: ApiAuthHeaders,
    @TypedQuery() query: ReviewQuery,
  ): Promise<ReviewWithRelationsDto[]> {
    const reviews = await this.reviewService.findManyReviews(
      { productType: 'course' },
      { ...DEFAULT_PAGINATION, ...query },
    );

    return reviews.map(reviewToDto);
  }

  /**
   * 특정 강의 리뷰를 조회합니다.
   *
   * @tag review-course
   * @summary 특정 리뷰 조회
   * @param id - 조회할 강의 리뷰의 id
   */
  @TypedRoute.Get('/:id')
  @SkipAuth()
  async getCourseReview(
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
   * 강의 리뷰를 생성합니다.
   *
   * @tag review-course
   * @summary 강의 리뷰 생성
   */
  @TypedRoute.Post('/')
  async createCourseReview(
    @TypedHeaders() headers: AuthHeaders,
    @TypedBody() body: CreateCourseReviewDto,
  ): Promise<ReviewWithRelationsDto> {
    const review = await this.courseReviewService.createCourseReview({
      courseId: body.courseId,
      reviewCreateParams: {
        ...body,
        productType: 'course',
      },
      snapshotCreateParams: {
        ...body,
      },
    });

    return reviewToDto(review);
  }
}
