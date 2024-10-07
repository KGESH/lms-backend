import { Controller, UseGuards } from '@nestjs/common';
import { UiCraftService } from '@src/v1/ui/craft/ui-craft.service';
import {
  TypedBody,
  TypedException,
  TypedHeaders,
  TypedQuery,
  TypedRoute,
} from '@nestia/core';
import {
  UiCraftCanvasQuery,
  UiCraftComponentDto,
  UiCraftComponentUpsertDto,
} from '@src/v1/ui/craft/ui-craft.dto';
import { Roles } from '@src/core/decorators/roles.decorator';
import { RolesGuard } from '@src/core/guards/roles.guard';
import { TypeGuardError } from 'typia';
import { IErrorResponse } from '@src/shared/types/response';
import { INVALID_LMS_SECRET } from '@src/core/error-code.constant';
import { ApiAuthHeaders, AuthHeaders } from '@src/v1/auth/auth.headers';
import * as date from '@src/shared/utils/date';
import { SkipAuth } from '@src/core/decorators/skip-auth.decorator';

@Controller('v1/ui/craft')
export class UiCraftController {
  constructor(private readonly uiCraftService: UiCraftService) {}

  /**
   * UI 컴포넌트 트리를 불러옵니다.
   *
   * @tag ui-craft
   * @summary UI 컴포넌트 트리 조회
   */
  @TypedRoute.Get('/canvas')
  @SkipAuth()
  @TypedException<TypeGuardError>({
    status: 400,
    description: 'invalid request',
  })
  @TypedException<IErrorResponse<INVALID_LMS_SECRET>>({
    status: INVALID_LMS_SECRET,
    description: 'invalid LMS api secret',
  })
  async getCanvasByPath(
    @TypedHeaders() headers: ApiAuthHeaders,
    @TypedQuery() query: UiCraftCanvasQuery,
  ): Promise<UiCraftComponentDto | null> {
    const canvas = await this.uiCraftService.findCraftComponentByPath(query);

    if (!canvas) {
      return null;
    }

    return {
      ...canvas,
      createdAt: date.toISOString(canvas.createdAt),
      updatedAt: date.toISOString(canvas.updatedAt),
    };
  }

  /**
   * ui 빌더 에디터에서 저장한 UI 컴포넌트 트리를 저장합니다.
   *
   * @tag ui-craft
   * @summary ui 빌더 정보 저장
   */
  @TypedRoute.Post('/canvas')
  @Roles('admin', 'manager')
  @UseGuards(RolesGuard)
  @TypedException<TypeGuardError>({
    status: 400,
    description: 'invalid request',
  })
  @TypedException<IErrorResponse<403>>({
    status: 403,
    description: 'Not enough [role] to access this resource.',
  })
  @TypedException<IErrorResponse<409>>({
    status: 409,
    description: 'UI component name must be unique.',
  })
  @TypedException<IErrorResponse<INVALID_LMS_SECRET>>({
    status: INVALID_LMS_SECRET,
    description: 'invalid LMS api secret',
  })
  async upsertCanvas(
    @TypedHeaders() headers: AuthHeaders,
    @TypedBody() body: UiCraftComponentUpsertDto,
  ): Promise<UiCraftComponentDto> {
    const canvas = await this.uiCraftService.upsertCraftComponent(body);

    return {
      ...canvas,
      createdAt: date.toISOString(canvas.createdAt),
      updatedAt: date.toISOString(canvas.updatedAt),
    };
  }
}
