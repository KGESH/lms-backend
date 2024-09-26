import { Controller, UseGuards } from '@nestjs/common';
import {
  TypedBody,
  TypedException,
  TypedHeaders,
  TypedParam,
  TypedRoute,
} from '@nestia/core';
import { TypeGuardError } from 'typia';
import { UiMarketingBannerService } from '@src/v1/ui/component/marketing-banner/ui-marketing-banner.service';
import { Uuid } from '@src/shared/types/primitive';
import {
  CreateUiMarketingBannerDto,
  UiMarketingBannerDto,
  UpdateUiMarketingBannerDto,
} from '@src/v1/ui/component/marketing-banner/ui-marketing-banner.dto';
import { SkipAuth } from '@src/core/decorators/skip-auth.decorator';
import { ApiAuthHeaders, AuthHeaders } from '@src/v1/auth/auth.headers';
import { Roles } from '@src/core/decorators/roles.decorator';
import { RolesGuard } from '@src/core/guards/roles.guard';
import { IErrorResponse } from '@src/shared/types/response';
import { INVALID_LMS_SECRET } from '@src/core/error-code.constant';

@Controller('v1/ui/component/marketing-banner')
export class UiMarketingBannerController {
  constructor(
    private readonly uiMarketingBannerService: UiMarketingBannerService,
  ) {}

  /**
   * 마케팅 배너 UI를 조회합니다.
   *
   * @tag ui
   * @summary 마케팅 배너 UI를 조회합니다.
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
  async getUiMarketingBanner(
    @TypedHeaders() headers: ApiAuthHeaders,
    @TypedParam('uiComponentId') uiComponentId: Uuid,
  ): Promise<UiMarketingBannerDto | null> {
    const uiMarketingBanner =
      await this.uiMarketingBannerService.findUiMarketingBanner({
        uiComponentId,
      });
    return uiMarketingBanner;
  }

  /**
   * 마케팅 배너 UI를 생성합니다.
   *
   * 관리자 세션 id를 헤더에 담아서 요청합니다.
   *
   * @tag ui
   * @summary 마케팅 배너 UI를 생성합니다.
   */
  @TypedRoute.Post('/')
  @Roles('admin', 'manager')
  @UseGuards(RolesGuard)
  @TypedException<TypeGuardError>({
    status: 400,
    description: 'invalid request',
  })
  @TypedException<IErrorResponse<404>>({
    status: 404,
    description: 'user not found',
  })
  @TypedException<IErrorResponse<409>>({
    status: 409,
    description: 'UI component name must be unique.',
  })
  @TypedException<IErrorResponse<INVALID_LMS_SECRET>>({
    status: INVALID_LMS_SECRET,
    description: 'invalid LMS api secret',
  })
  async createUiMarketingBanner(
    @TypedHeaders() headers: AuthHeaders,
    @TypedBody() body: CreateUiMarketingBannerDto,
  ): Promise<UiMarketingBannerDto> {
    const uiMarketingBanner =
      await this.uiMarketingBannerService.createUiMarketingBanner({
        ...body,
        ui: {
          ...body.ui,
        },
      });
    return uiMarketingBanner;
  }

  /**
   * 마케팅 배너 UI를 수정합니다.
   *
   * 관리자 세션 id를 헤더에 담아서 요청합니다.
   *
   * @tag ui
   * @summary 마케팅 배너 UI를 수정합니다.
   */
  @TypedRoute.Patch('/:uiComponentId')
  @Roles('admin', 'manager')
  @UseGuards(RolesGuard)
  @TypedException<TypeGuardError>({
    status: 400,
    description: 'invalid request',
  })
  @TypedException<IErrorResponse<404>>({
    status: 404,
    description: 'UI Marketing Banner not found.',
  })
  @TypedException<IErrorResponse<409>>({
    status: 409,
    description: 'UI component name must be unique.',
  })
  @TypedException<IErrorResponse<INVALID_LMS_SECRET>>({
    status: INVALID_LMS_SECRET,
    description: 'invalid LMS api secret',
  })
  async updateUiMarketingBanner(
    @TypedHeaders() headers: AuthHeaders,
    @TypedParam('uiComponentId') uiComponentId: Uuid,
    @TypedBody() body: UpdateUiMarketingBannerDto,
  ): Promise<UiMarketingBannerDto> {
    const updated = await this.uiMarketingBannerService.updateUiMarketingBanner(
      { uiComponentId },
      body,
    );
    return updated;
  }
}
