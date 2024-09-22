import { Controller, Logger, UseGuards } from '@nestjs/common';
import {
  TypedException,
  TypedHeaders,
  TypedParam,
  TypedQuery,
  TypedRoute,
} from '@nestia/core';
import { UiComponentService } from '@src/v1/ui/component/ui-component.service';
import { Uuid } from '@src/shared/types/primitive';
import { SkipAuth } from '@src/core/decorators/skip-auth.decorator';
import { RolesGuard } from '@src/core/guards/roles.guard';
import { Roles } from '@src/core/decorators/roles.decorator';
import {
  UiComponentBaseDto,
  UiComponentQuery,
} from '@src/v1/ui/component/ui-component.dto';
import { ApiAuthHeaders, AuthHeaders } from '@src/v1/auth/auth.headers';
import { TypeGuardError } from 'typia';
import { IErrorResponse } from '@src/shared/types/response';
import { INVALID_LMS_SECRET } from '@src/core/error-code.constant';
import { IUiComponentGroup } from '@src/v1/ui/component/ui-component-group.dto';

@Controller('v1/ui/component')
export class UiComponentController {
  private readonly logger = new Logger(UiComponentController.name);
  constructor(private readonly uiComponentService: UiComponentService) {}

  /**
   * 특정 페이지 (path)에 속한 UI 컴포넌트 목록을 조회합니다. (e.g. 배너, 타이머 등)
   *
   * 응답받은 UI 컴포넌트 목록을 통해 해당 페이지의 UI를 구성할 수 있습니다.
   *
   * @tag ui
   * @summary 특정 페이지 (path)에 속한 UI 컴포넌트 목록을 조회합니다.
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
  async getUiComponentsByPath(
    @TypedHeaders() headers: ApiAuthHeaders,
    @TypedQuery() query: UiComponentQuery,
  ): Promise<IUiComponentGroup> {
    const uiComponents = await this.uiComponentService.getUiComponentsByPath({
      path: query.path,
    });
    return uiComponents;
  }

  /**
   * UI 컴포넌트를 삭제합니다.
   *
   * 관리자 세션 id를 헤더에 담아서 요청합니다.
   *
   * Hard delete로 구현되어 있습니다.
   *
   * @tag ui
   * @summary UI 컴포넌트를 삭제합니다.
   * @param uiComponentId - 삭제할 UI 컴포넌트 id
   */
  @TypedRoute.Delete('/:uiComponentId')
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
  async deleteUiComponent(
    @TypedHeaders() headers: AuthHeaders,
    @TypedParam('uiComponentId') uiComponentId: Uuid,
  ): Promise<UiComponentBaseDto> {
    const deleted = await this.uiComponentService.deleteUiComponent({
      id: uiComponentId,
    });
    return deleted;
  }
}
