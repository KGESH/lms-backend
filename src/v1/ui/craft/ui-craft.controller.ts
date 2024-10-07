import { Controller, UseGuards } from '@nestjs/common';
import { UiCraftService } from '@src/v1/ui/craft/ui-craft.service';
import {
  TypedBody,
  TypedException,
  TypedHeaders,
  TypedRoute,
} from '@nestia/core';
import {
  UiCraftComponentDto,
  UiCraftComponentUpsertDto,
} from '@src/v1/ui/craft/ui-craft.dto';
import { Roles } from '@src/core/decorators/roles.decorator';
import { RolesGuard } from '@src/core/guards/roles.guard';
import { TypeGuardError } from 'typia';
import { IErrorResponse } from '@src/shared/types/response';
import { INVALID_LMS_SECRET } from '@src/core/error-code.constant';
import { AuthHeaders } from '@src/v1/auth/auth.headers';
import * as date from '@src/shared/utils/date';

@Controller('v1/ui/craft')
export class UiCraftController {
  constructor(private readonly uiCraftService: UiCraftService) {}

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
