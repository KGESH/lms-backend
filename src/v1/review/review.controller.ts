import { Controller } from '@nestjs/common';
import { ReviewService } from './review.service';
import { TypedBody, TypedParam, TypedQuery, TypedRoute } from '@nestia/core';
import { Uuid } from '../../shared/types/primitive';
import { ReviewQuery, ReviewWithRelationsDto } from './review.dto';
import { DEFAULT_PAGINATION } from '../../core/pagination.constant';
import { reviewToDto } from '../../shared/helpers/transofrm/review';
import { CreateCourseReviewDto } from './course-review/course-review.dto';

@Controller('v1/review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @TypedRoute.Get('/')
  async getReviews(
    @TypedQuery() query: ReviewQuery,
  ): Promise<ReviewWithRelationsDto[]> {
    const reviews = await this.reviewService.findManyReviews(
      { productType: query.productType },
      { ...DEFAULT_PAGINATION, ...query },
    );

    return reviews.map(reviewToDto);
  }

  @TypedRoute.Get('/:id')
  async getReview(
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
