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
  UpdateUiCarouselReviewItemDto,
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

  /**
   * 리뷰 캐러셀 UI를 조회합니다.
   *
   * @tag ui
   * @summary 리뷰 캐러셀 UI 조회.
   */
  @TypedRoute.Get('/:uiComponentId')
  @SkipAuth()
  async getUiCarouselReview(
    @TypedHeaders() headers: ApiAuthHeaders,
    @TypedParam('uiComponentId') uiComponentId: Uuid,
  ): Promise<UiCarouselReviewWithItemsDto | null> {
    const carouselWithItems =
      await this.uiCarouselReviewService.getUiCarouselReviewWithItems({
        uiComponentId,
      });

    if (!carouselWithItems) {
      return null;
    }

    const { uiCarousel, uiCarouselReviewItems } = carouselWithItems;
    return { uiCarousel, uiCarouselReviewItems };
  }

  /**
   * 리뷰 캐러셀 UI를 생성합니다.
   *
   * 관리자 세션 id를 헤더에 담아서 요청합니다.
   *
   * 캐러셀 UI 생성 이후, 아이템 생성 API를 호출해야 합니다.
   *
   * @tag ui
   * @summary 리뷰 캐러셀 UI 생성.
   */
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

  /**
   * 리뷰 캐러셀 UI의 아이템을 생성합니다.
   *
   * 관리자 세션 id를 헤더에 담아서 요청합니다.
   *
   * @tag ui
   * @summary 리뷰 캐러셀 UI 아이템 생성.
   */
  @TypedRoute.Post('/:uiComponentId/item')
  @Roles('admin', 'manager')
  @UseGuards(RolesGuard)
  @TypedException<TypeGuardError>({
    status: 400,
    description: 'invalid request',
  })
  async createUiCarouselReviewItems(
    @TypedHeaders() headers: AuthHeaders,
    @TypedParam('uiComponentId') uiComponentId: Uuid,
    @TypedBody() body: CreateUiCarouselReviewItemDto[],
  ): Promise<UiCarouselReviewItemDto[]> {
    return await this.uiCarouselReviewService.createUiCarouselReviewItems(
      { uiComponentId },
      body,
    );
  }

  /**
   * 리뷰 캐러셀 UI의 아이템 목록을 수정합니다.
   *
   * 관리자 세션 id를 헤더에 담아서 요청합니다.
   *
   * @tag ui
   * @summary 리뷰 캐러셀 UI 아이템 수정.
   */
  @TypedRoute.Patch('/item')
  @Roles('admin', 'manager')
  @UseGuards(RolesGuard)
  @TypedException<TypeGuardError>({
    status: 400,
    description: 'invalid request',
  })
  async updateUiCarouselReviewItems(
    @TypedHeaders() headers: AuthHeaders,
    @TypedBody() body: UpdateUiCarouselReviewItemDto[],
  ): Promise<UiCarouselReviewItemDto[]> {
    return await this.uiCarouselReviewService.updateUiCarouselReviewItems(body);
  }

  /**
   * 리뷰 캐러셀 UI의 아이템 목록을 삭제합니다.
   *
   * 관리자 세션 id를 헤더에 담아서 요청합니다.
   *
   * HardHard delete로 구현되어 있습니다.
   *
   * @tag ui
   * @summary 리뷰 캐러셀 UI 아이템 삭제.
   */
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
