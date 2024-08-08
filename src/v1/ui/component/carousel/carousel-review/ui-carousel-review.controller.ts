import { Controller, Logger } from '@nestjs/common';
import { UiCarouselReviewService } from './ui-carousel-review.service';
import { TypedBody, TypedParam, TypedQuery, TypedRoute } from '@nestia/core';
import {
  CreateUiCarouselReviewDto,
  CreateUiCarouselReviewItemDto,
  DeleteUiCarouselReviewItemsQuery,
  UiCarouselReviewItemDto,
  UiCarouselReviewWithItemsDto,
} from './ui-carousel-review.dto';
import { Uuid } from '../../../../../shared/types/primitive';
import { UiCarouselDto } from '../ui-carousel.dto';
import { UiCarouselReview } from '../../../category/ui-category.interface';

@Controller('v1/ui/component/carousel-review')
export class UiCarouselReviewController {
  private readonly logger = new Logger(UiCarouselReviewController.name);
  constructor(
    private readonly uiCarouselReviewService: UiCarouselReviewService,
  ) {}

  @TypedRoute.Get('/:id')
  async getUiCarouselReview(
    @TypedParam('id') id: Uuid,
  ): Promise<UiCarouselReviewWithItemsDto | null> {
    const carouselWithItems =
      await this.uiCarouselReviewService.getUiCarouselReviewWithItemsById({
        uiCarouselId: id,
      });

    if (!carouselWithItems) {
      return null;
    }

    const { uiCarousel, uiCarouselReviewItems } = carouselWithItems;
    return { uiCarousel, uiCarouselReviewItems };
  }

  @TypedRoute.Post('/')
  async createUiCarouselReview(
    @TypedBody() body: CreateUiCarouselReviewDto,
  ): Promise<UiCarouselDto<UiCarouselReview>> {
    const uiCarousel =
      await this.uiCarouselReviewService.createUiCarouselReview(body);

    return uiCarousel;
  }

  @TypedRoute.Post('/item')
  async createUiCarouselReviewItems(
    @TypedBody() body: CreateUiCarouselReviewItemDto[],
  ): Promise<UiCarouselReviewItemDto[]> {
    return await this.uiCarouselReviewService.createUiCarouselReviewItems(body);
  }

  @TypedRoute.Delete('/item')
  async deleteUiCarouselReviewItems(
    @TypedQuery() query: DeleteUiCarouselReviewItemsQuery,
  ): Promise<UiCarouselReviewItemDto[]> {
    const deletedItems =
      await this.uiCarouselReviewService.deleteUiCarouselReviewItems(query.ids);

    return deletedItems;
  }
}
