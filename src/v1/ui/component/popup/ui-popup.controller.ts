import { Controller, UseGuards } from '@nestjs/common';
import {
  TypedBody,
  TypedException,
  TypedHeaders,
  TypedParam,
  TypedQuery,
  TypedRoute,
} from '@nestia/core';
import { TypeGuardError } from 'typia';
import { UiPopupService } from '@src/v1/ui/component/popup/ui-popup.service';
import { Uuid } from '@src/shared/types/primitive';
import {
  CreateUiPopupDto,
  UiPopupDto,
  UiPopupQuery,
  UpdateUiPopupDto,
} from '@src/v1/ui/component/popup/ui-popup.dto';
import { SkipAuth } from '@src/core/decorators/skip-auth.decorator';
import { ApiAuthHeaders, AuthHeaders } from '@src/v1/auth/auth.headers';
import { Roles } from '@src/core/decorators/roles.decorator';
import { RolesGuard } from '@src/core/guards/roles.guard';
import { IErrorResponse } from '@src/shared/types/response';
import { INVALID_LMS_SECRET } from '@src/core/error-code.constant';
import { withDefaultPagination } from '@src/core/pagination';
import { Paginated } from '@src/shared/types/pagination';
import { uiPopupToDto } from '@src/shared/helpers/transofrm/popup';

@Controller('v1/ui/component/popup')
export class UiPopupController {
  constructor(private readonly uiPopupService: UiPopupService) {}

  /**
   * 팝업 UI 목록을 조회합니다.
   *
   * @tag ui
   * @summary 팝업 UI 목록을 조회합니다.
   */
  @TypedRoute.Get('/')
  @SkipAuth()
  @TypedException<TypeGuardError>({
    status: 400,
    description: 'invalid request',
  })
  @TypedException<IErrorResponse<INVALID_LMS_SECRET>>({
    status: INVALID_LMS_SECRET,
    description: 'invalid LMS api secret',
  })
  async getUiPopups(
    @TypedHeaders() headers: ApiAuthHeaders,
    @TypedQuery() query: UiPopupQuery,
  ): Promise<Paginated<UiPopupDto[]>> {
    const {
      pagination,
      totalCount,
      data: paginatedPopups,
    } = await this.uiPopupService.findUiPopups(withDefaultPagination(query));

    return {
      pagination,
      totalCount,
      data: paginatedPopups.map(uiPopupToDto),
    };
  }

  /**
   * 팝업 UI를 조회합니다.
   *
   * @tag ui
   * @summary 팝업 UI를 조회합니다.
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
  async getUiPopup(
    @TypedHeaders() headers: ApiAuthHeaders,
    @TypedParam('uiComponentId') uiComponentId: Uuid,
  ): Promise<UiPopupDto | null> {
    const uiPopup = await this.uiPopupService.findUiPopup({
      uiComponentId,
    });

    if (!uiPopup) {
      return null;
    }

    return uiPopupToDto(uiPopup);
  }

  /**
   * 팝업 UI를 생성합니다.
   *
   * 관리자 세션 id를 헤더에 담아서 요청합니다.
   *
   * @tag ui
   * @summary 팝업 UI를 생성합니다.
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
  async createUiPopup(
    @TypedHeaders() headers: AuthHeaders,
    @TypedBody() body: CreateUiPopupDto,
  ): Promise<UiPopupDto> {
    const uiPopup = await this.uiPopupService.createUiPopup(body);

    return uiPopupToDto(uiPopup);
  }

  /**
   * 팝업 UI를 수정합니다.
   *
   * 관리자 세션 id를 헤더에 담아서 요청합니다.
   *
   * @tag ui
   * @summary 팝업 UI를 수정합니다.
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
    description: 'UI Popup not found.',
  })
  @TypedException<IErrorResponse<409>>({
    status: 409,
    description: 'UI component name must be unique.',
  })
  @TypedException<IErrorResponse<INVALID_LMS_SECRET>>({
    status: INVALID_LMS_SECRET,
    description: 'invalid LMS api secret',
  })
  async updateUiPopup(
    @TypedHeaders() headers: AuthHeaders,
    @TypedParam('uiComponentId') uiComponentId: Uuid,
    @TypedBody() body: UpdateUiPopupDto,
  ): Promise<UiPopupDto> {
    const updated = await this.uiPopupService.updateUiPopup(
      { uiComponentId },
      body,
    );

    return uiPopupToDto(updated);
  }
}
