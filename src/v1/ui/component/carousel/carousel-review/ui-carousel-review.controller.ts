import { Controller, Logger, UseGuards } from '@nestjs/common';
import { TypeGuardError } from 'typia';
import { UiCarouselReviewService } from '@src/v1/ui/component/carousel/carousel-review/ui-carousel-review.service';
import {
  TypedBody,
  TypedException,
  TypedHeaders,
  TypedParam,
  TypedQuery,
  TypedRoute,
} from '@nestia/core';
import {
  CreateUiCarouselReviewDto,
  CreateUiCarouselReviewItemDto,
  DeleteUiCarouselReviewItemsQuery,
  UiCarouselReviewItemDto,
  UiCarouselReviewWithItemsDto,
} from '@src/v1/ui/component/carousel/carousel-review/ui-carousel-review.dto';
import { Uuid } from '@src/shared/types/primitive';
import { UiCarouselDto } from '@src/v1/ui/component/carousel/ui-carousel.dto';
import { UiCarouselReview } from '@src/v1/ui/category/ui-category.interface';
import { SkipAuth } from '@src/core/decorators/skip-auth.decorator';
import { ApiAuthHeaders, AuthHeaders } from '@src/v1/auth/auth.headers';
import { Roles } from '@src/core/decorators/roles.decorator';
import { RolesGuard } from '@src/core/guards/roles.guard';

@Controller('v1/ui/component/carousel-review')
export class UiCarouselReviewController {
  private readonly logger = new Logger(UiCarouselReviewController.name);
  constructor(
    private readonly uiCarouselReviewService: UiCarouselReviewService,
  ) {}

  @TypedRoute.Get('/:id')
  @SkipAuth()
  async getUiCarouselReview(
    @TypedHeaders() headers: ApiAuthHeaders,
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
  @Roles('admin', 'manager')
  @UseGuards(RolesGuard)
  @TypedException<TypeGuardError>({
    status: 400,
    description: 'invalid request',
  })
  async createUiCarouselReview(
    @TypedHeaders() headers: AuthHeaders,
    @TypedBody() body: CreateUiCarouselReviewDto,
  ): Promise<UiCarouselDto<UiCarouselReview>> {
    const uiCarousel =
      await this.uiCarouselReviewService.createUiCarouselReview(body);

    return uiCarousel;
  }

  @TypedRoute.Post('/item')
  @Roles('admin', 'manager')
  @UseGuards(RolesGuard)
  @TypedException<TypeGuardError>({
    status: 400,
    description: 'invalid request',
  })
  async createUiCarouselReviewItems(
    @TypedHeaders() headers: AuthHeaders,
    @TypedBody() body: CreateUiCarouselReviewItemDto[],
  ): Promise<UiCarouselReviewItemDto[]> {
    return await this.uiCarouselReviewService.createUiCarouselReviewItems(body);
  }

  @TypedRoute.Delete('/item')
  @Roles('admin', 'manager')
  @UseGuards(RolesGuard)
  @TypedException<TypeGuardError>({
    status: 400,
    description: 'invalid request',
  })
  async deleteUiCarouselReviewItems(
    @TypedHeaders() headers: AuthHeaders,
    @TypedQuery() query: DeleteUiCarouselReviewItemsQuery,
  ): Promise<UiCarouselReviewItemDto[]> {
    const deletedItems =
      await this.uiCarouselReviewService.deleteUiCarouselReviewItems(query.ids);

    return deletedItems;
  }
}
