import { Controller, UseGuards } from '@nestjs/common';
import {
  TypedBody,
  TypedException,
  TypedHeaders,
  TypedParam,
  TypedRoute,
} from '@nestia/core';
import { TypeGuardError } from 'typia';
import { UiBannerService } from '@src/v1/ui/component/banner/ui-banner.service';
import { Uuid } from '@src/shared/types/primitive';
import {
  CreateUiBannerDto,
  UiBannerDto,
  UpdateUiBannerDto,
} from '@src/v1/ui/component/banner/ui-banner.dto';
import { SkipAuth } from '@src/core/decorators/skip-auth.decorator';
import { ApiAuthHeaders, AuthHeaders } from '@src/v1/auth/auth.headers';
import { Roles } from '@src/core/decorators/roles.decorator';
import { RolesGuard } from '@src/core/guards/roles.guard';
import { IErrorResponse } from '@src/shared/types/response';
import { INVALID_LMS_SECRET } from '@src/core/error-code.constant';

@Controller('v1/ui/component/banner')
export class UiBannerController {
  constructor(private readonly uiBannerService: UiBannerService) {}

  /**
   * 배너 UI를 조회합니다.
   *
   * @tag ui
   * @summary 배너 UI를 조회합니다.
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
  async getUiBanner(
    @TypedHeaders() headers: ApiAuthHeaders,
    @TypedParam('uiComponentId') uiComponentId: Uuid,
  ): Promise<UiBannerDto | null> {
    const uiBanner = await this.uiBannerService.findUiBanner({
      uiComponentId,
    });
    return uiBanner;
  }

  /**
   * 배너 UI를 생성합니다.
   *
   * 관리자 세션 id를 헤더에 담아서 요청합니다.
   *
   * @tag ui
   * @summary 배너 UI를 생성합니다.
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
  async createUiBanner(
    @TypedHeaders() headers: AuthHeaders,
    @TypedBody() body: CreateUiBannerDto,
  ): Promise<UiBannerDto> {
    const uiBanner = await this.uiBannerService.createUiBanner({
      ...body,
      ui: {
        ...body.ui,
      },
    });
    return uiBanner;
  }

  /**
   * 배너 UI를 수정합니다.
   *
   * 관리자 세션 id를 헤더에 담아서 요청합니다.
   *
   * @tag ui
   * @summary 배너 UI를 수정합니다.
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
    description: 'UI banner not found.',
  })
  @TypedException<IErrorResponse<409>>({
    status: 409,
    description: 'UI component name must be unique.',
  })
  @TypedException<IErrorResponse<INVALID_LMS_SECRET>>({
    status: INVALID_LMS_SECRET,
    description: 'invalid LMS api secret',
  })
  async updateUiBanner(
    @TypedHeaders() headers: AuthHeaders,
    @TypedParam('uiComponentId') uiComponentId: Uuid,
    @TypedBody() body: UpdateUiBannerDto,
  ): Promise<UiBannerDto> {
    const updated = await this.uiBannerService.updateUiBanner(
      { uiComponentId },
      body,
    );
    return updated;
  }
}
