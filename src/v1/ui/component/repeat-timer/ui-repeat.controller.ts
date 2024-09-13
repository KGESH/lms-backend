import { Controller, UseGuards } from '@nestjs/common';
import {
  TypedBody,
  TypedException,
  TypedHeaders,
  TypedParam,
  TypedRoute,
} from '@nestia/core';
import { TypeGuardError } from 'typia';
import { UiRepeatTimerService } from '@src/v1/ui/component/repeat-timer/ui-repeat-timer.service';
import { Uuid } from '@src/shared/types/primitive';
import {
  CreateUiRepeatTimerDto,
  UiRepeatTimerDto,
  UpdateUiRepeatTimerDto,
} from '@src/v1/ui/component/repeat-timer/ui-repeat-timer.dto';
import { SkipAuth } from '@src/core/decorators/skip-auth.decorator';
import { ApiAuthHeaders, AuthHeaders } from '@src/v1/auth/auth.headers';
import { Roles } from '@src/core/decorators/roles.decorator';
import { RolesGuard } from '@src/core/guards/roles.guard';
import { IErrorResponse } from '@src/shared/types/response';

@Controller('v1/ui/component/repeat-timer')
export class UiRepeatTimerController {
  constructor(private readonly uiRepeatTimerService: UiRepeatTimerService) {}

  /**
   * 타이머 UI를 조회합니다.
   *
   * @tag ui
   * @summary 타이머 UI를 조회합니다.
   */
  @TypedRoute.Get('/:uiComponentId')
  @SkipAuth()
  async getUiRepeatTimer(
    @TypedHeaders() headers: ApiAuthHeaders,
    @TypedParam('uiComponentId') uiComponentId: Uuid,
  ): Promise<UiRepeatTimerDto | null> {
    const uiRepeatTimer = await this.uiRepeatTimerService.findUiRepeatTimer({
      uiComponentId,
    });
    return uiRepeatTimer;
  }

  /**
   * 타이머 UI를 생성합니다.
   *
   * 관리자 세션 id를 헤더에 담아서 요청합니다.
   *
   * @tag ui
   * @summary 타이머 UI를 생성합니다.
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
  async createUiRepeatTimer(
    @TypedHeaders() headers: AuthHeaders,
    @TypedBody() body: CreateUiRepeatTimerDto,
  ): Promise<UiRepeatTimerDto> {
    const uiRepeatTimer = await this.uiRepeatTimerService.createUiRepeatTimer({
      ...body,
      ui: {
        ...body.ui,
      },
    });
    return uiRepeatTimer;
  }

  /**
   * 타이머 UI를 수정합니다.
   *
   * 관리자 세션 id를 헤더에 담아서 요청합니다.
   *
   * @tag ui
   * @summary 타이머 UI를 수정합니다.
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
    description: 'user not found',
  })
  async updateUiRepeatTimer(
    @TypedHeaders() headers: AuthHeaders,
    @TypedParam('uiComponentId') uiComponentId: Uuid,
    @TypedBody() body: UpdateUiRepeatTimerDto,
  ): Promise<UiRepeatTimerDto> {
    const updated = await this.uiRepeatTimerService.updateUiRepeatTimer(
      { uiComponentId },
      body,
    );
    return updated;
  }
}
