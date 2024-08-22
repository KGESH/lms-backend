import { Controller, Logger, UseGuards } from '@nestjs/common';
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
  DeletedUiRepeatTimerDto,
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
  private readonly logger = new Logger(UiRepeatTimerController.name);

  constructor(private readonly uiRepeatTimerService: UiRepeatTimerService) {}

  @TypedRoute.Get('/:id')
  @SkipAuth()
  async getUiRepeatTimer(
    @TypedHeaders() headers: ApiAuthHeaders,
    @TypedParam('id') id: Uuid,
  ): Promise<UiRepeatTimerDto | null> {
    const uiRepeatTimer = await this.uiRepeatTimerService.findUiRepeatTimer({
      id,
    });
    return uiRepeatTimer;
  }

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

  @TypedRoute.Patch('/:id')
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
    @TypedParam('id') id: Uuid,
    @TypedBody() body: UpdateUiRepeatTimerDto,
  ): Promise<UiRepeatTimerDto> {
    const updated = await this.uiRepeatTimerService.updateUiRepeatTimer(
      { id },
      body,
    );
    return updated;
  }

  @TypedRoute.Delete('/:id')
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
  async deleteUiRepeatTimer(
    @TypedHeaders() headers: AuthHeaders,
    @TypedParam('id') id: Uuid,
  ): Promise<DeletedUiRepeatTimerDto> {
    const deletedId = await this.uiRepeatTimerService.deleteUiRepeatTimer({
      id,
    });

    return {
      id: deletedId,
    };
  }
}
