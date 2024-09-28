import { Controller, Logger, UseGuards } from '@nestjs/common';
import { TypeGuardError } from 'typia';
import {
  TypedBody,
  TypedException,
  TypedHeaders,
  TypedParam,
  TypedQuery,
  TypedRoute,
} from '@nestia/core';
import { Uuid } from '@src/shared/types/primitive';
import {
  UiCarouselDto,
  UpdateUiCarouselDto,
} from '@src/v1/ui/component/carousel/ui-carousel.dto';
import { UiCarouselMainBanner } from '@src/v1/ui/category/ui-category.interface';
import { SkipAuth } from '@src/core/decorators/skip-auth.decorator';
import { ApiAuthHeaders, AuthHeaders } from '@src/v1/auth/auth.headers';
import { Roles } from '@src/core/decorators/roles.decorator';
import { RolesGuard } from '@src/core/guards/roles.guard';
import {
  CreateUiCarouselMainBannerContentDto,
  CreateUiCarouselMainBannerDto,
  DeleteUiCarouselMainBannerItems,
  UiCarouselMainBannerWithContentsDto,
} from '@src/v1/ui/component/carousel/carousel-main-banner/ui-carousel-main-banner.dto';
import { UiCarouselMainBannerService } from '@src/v1/ui/component/carousel/carousel-main-banner/ui-carousel-main-banner.service';
import {
  UiCarouselContentDto,
  UiCarouselContentUpdateDto,
} from '@src/v1/ui/component/carousel/carousel-content/ui-carousel-content.dto';
import { IErrorResponse } from '@src/shared/types/response';
import { INVALID_LMS_SECRET } from '@src/core/error-code.constant';

@Controller('v1/ui/component/carousel-main-banner')
export class UiCarouselMainBannerController {
  private readonly logger = new Logger(UiCarouselMainBannerController.name);
  constructor(
    private readonly uiCarouselMainBannerService: UiCarouselMainBannerService,
  ) {}

  /**
   * 메인 배너 캐러셀 UI를 조회합니다.
   *
   * @tag ui
   * @summary 메인 배너 캐러셀 UI 조회.
   */
  @TypedRoute.Get('/:uiComponentId')
  @SkipAuth()
  @TypedException<TypeGuardError>({
    status: 400,
    description: 'invalid request',
  })
  @TypedException<IErrorResponse<INVALID_LMS_SECRET>>({
    status: INVALID_LMS_SECRET,
    description: 'invalid LMS api secret',
  })
  async getUiCarouselMainBanner(
    @TypedHeaders() headers: ApiAuthHeaders,
    @TypedParam('uiComponentId') uiComponentId: Uuid,
  ): Promise<UiCarouselMainBannerWithContentsDto | null> {
    const carouselWithItems =
      await this.uiCarouselMainBannerService.findUiCarouselMainBannerWithContents(
        {
          uiComponentId,
        },
      );

    if (!carouselWithItems) {
      return null;
    }

    return carouselWithItems;
  }

  /**
   * 메인 배너 UI 캐러셀을 생성합니다.
   *
   * 관리자 세션 id를 헤더에 담아서 요청합니다.
   *
   * 캐러셀 UI 생성 이후, 메인 배너 캐러셀 아이템 생성 API를 호출해야 합니다.
   *
   * @tag ui
   * @summary 메인 배너 캐러셀 UI 생성.
   */
  @TypedRoute.Post('/')
  @Roles('admin', 'manager')
  @UseGuards(RolesGuard)
  @TypedException<TypeGuardError>({
    status: 400,
    description: 'invalid request',
  })
  @TypedException<IErrorResponse<409>>({
    status: 409,
    description: 'UI component name must be unique.',
  })
  @TypedException<IErrorResponse<INVALID_LMS_SECRET>>({
    status: INVALID_LMS_SECRET,
    description: 'invalid LMS api secret',
  })
  async createUiCarouselMainBanner(
    @TypedHeaders() headers: AuthHeaders,
    @TypedBody() body: CreateUiCarouselMainBannerDto,
  ): Promise<UiCarouselMainBannerWithContentsDto> {
    const uiCarousel =
      await this.uiCarouselMainBannerService.createUiCarouselMainBanner(
        body,
        body.carouselContentParams,
      );

    return uiCarousel;
  }

  /**
   * 메인 배너 UI 캐러셀의 아이템을 생성합니다.
   *
   * 관리자 세션 id를 헤더에 담아서 요청합니다.
   *
   * @tag ui
   * @summary 메인 배너 캐러셀 UI 아이템 생성.
   */
  @TypedRoute.Post('/:uiComponentId/item')
  @Roles('admin', 'manager')
  @UseGuards(RolesGuard)
  @TypedException<TypeGuardError>({
    status: 400,
    description: 'invalid request',
  })
  @TypedException<IErrorResponse<INVALID_LMS_SECRET>>({
    status: INVALID_LMS_SECRET,
    description: 'invalid LMS api secret',
  })
  async createUiCarouselMainBannerItems(
    @TypedHeaders() headers: AuthHeaders,
    @TypedParam('uiComponentId') uiComponentId: Uuid,
    @TypedBody() body: CreateUiCarouselMainBannerContentDto[],
  ): Promise<UiCarouselContentDto[]> {
    const items =
      await this.uiCarouselMainBannerService.createUiCarouselMainBannerItems(
        { uiComponentId },
        body,
      );

    return items;
  }

  /**
   * 메인 배너 캐러셀을 수정합니다.
   *
   * 관리자 세션 id를 헤더에 담아서 요청합니다.
   *
   * @tag ui
   * @summary 메인 배너 캐러셀 UI 수정.
   */
  @TypedRoute.Patch('/:uiComponentId')
  @Roles('admin', 'manager')
  @UseGuards(RolesGuard)
  @TypedException<TypeGuardError>({
    status: 400,
    description: 'invalid request',
  })
  @TypedException<IErrorResponse<409>>({
    status: 409,
    description: 'UI component name must be unique.',
  })
  @TypedException<IErrorResponse<INVALID_LMS_SECRET>>({
    status: INVALID_LMS_SECRET,
    description: 'invalid LMS api secret',
  })
  async updateUiCarouselMainBanner(
    @TypedHeaders() headers: AuthHeaders,
    @TypedParam('uiComponentId') uiComponentId: Uuid,
    @TypedBody() body: UpdateUiCarouselDto<UiCarouselMainBanner>,
  ): Promise<UiCarouselDto<UiCarouselMainBanner>> {
    const updated =
      await this.uiCarouselMainBannerService.updateUiCarouselMainBanner(
        {
          uiComponentId,
        },
        body,
      );

    return updated;
  }

  /**
   * 메인 배너 캐러셀 UI의 아이템을 수정합니다.
   *
   * 관리자 세션 id를 헤더에 담아서 요청합니다.
   *
   * @tag ui
   * @summary 메인 배너 캐러셀 UI 아이템 수정.
   */
  @TypedRoute.Patch('/:uiComponentId/item')
  @Roles('admin', 'manager')
  @UseGuards(RolesGuard)
  @TypedException<TypeGuardError>({
    status: 400,
    description: 'invalid request',
  })
  @TypedException<IErrorResponse<INVALID_LMS_SECRET>>({
    status: INVALID_LMS_SECRET,
    description: 'invalid LMS api secret',
  })
  async updateUiCarouselMainBannerItems(
    @TypedHeaders() headers: AuthHeaders,
    @TypedParam('uiComponentId') uiComponentId: Uuid,
    @TypedBody() body: UiCarouselContentUpdateDto[],
  ): Promise<UiCarouselContentDto[]> {
    const updatedItem =
      await this.uiCarouselMainBannerService.updateUiCarouselMainBannerItems(
        body,
      );

    return updatedItem;
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
  @TypedException<IErrorResponse<INVALID_LMS_SECRET>>({
    status: INVALID_LMS_SECRET,
    description: 'invalid LMS api secret',
  })
  async deleteUiCarouselMainBannerItems(
    @TypedHeaders() headers: AuthHeaders,
    @TypedQuery() query: DeleteUiCarouselMainBannerItems,
  ): Promise<Uuid[]> {
    const deletedIds =
      await this.uiCarouselMainBannerService.deleteUiCarouselMainBannerItems(
        query.ids,
      );

    return deletedIds;
  }
}
