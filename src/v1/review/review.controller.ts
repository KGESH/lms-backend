import { Controller } from '@nestjs/common';
import { ReviewService } from './review.service';
import {
  TypedBody,
  TypedHeaders,
  TypedParam,
  TypedQuery,
  TypedRoute,
} from '@nestia/core';
import { Uuid } from '../../shared/types/primitive';
import { ReviewQuery, ReviewWithRelationsDto } from './review.dto';
import { DEFAULT_PAGINATION } from '../../core/pagination.constant';
import { reviewToDto } from '../../shared/helpers/transofrm/review';
import { CreateCourseReviewDto } from './course-review/course-review.dto';
import { SkipAuth } from '../../core/decorators/skip-auth.decorator';
import { ApiAuthHeaders, AuthHeaders } from '../auth/auth.headers';

@Controller('v1/review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @TypedRoute.Get('/')
  @SkipAuth()
  async getReviews(
    @TypedHeaders() headers: ApiAuthHeaders,
    @TypedQuery() query: ReviewQuery,
  ): Promise<ReviewWithRelationsDto[]> {
    const reviews = await this.reviewService.findManyReviews(
      { productType: query.productType },
      { ...DEFAULT_PAGINATION, ...query },
    );

    return reviews.map(reviewToDto);
  }

  @TypedRoute.Get('/:id')
  @SkipAuth()
  async getReview(
    @TypedHeaders() headers: ApiAuthHeaders,
    @TypedParam('id') id: Uuid,
  ): Promise<ReviewWithRelationsDto | null> {
    const review = await this.reviewService.findOneById({ id });

    if (!review) {
      return null;
    }

    return reviewToDto(review);
  }

  @TypedRoute.Post('/course')
  async createCourseReview(
    @TypedHeaders() headers: AuthHeaders,
    @TypedBody() body: CreateCourseReviewDto,
  ): Promise<ReviewWithRelationsDto> {
    const review = await this.reviewService.createCourseReview({
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
