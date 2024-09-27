import { Controller, UseGuards } from '@nestjs/common';
import {
  TypedBody,
  TypedException,
  TypedHeaders,
  TypedParam,
  TypedRoute,
} from '@nestia/core';
import {
  CreatePromotionPageDto,
  PromotionDto,
  PromotionPageDto,
  UpdatePromotionDto,
} from '@src/v1/promotion/promotion.dto';
import { AuthHeaders } from '@src/v1/auth/auth.headers';
import { promotionPageToDto } from '@src/shared/helpers/transofrm/promotion';
import { TypeGuardError } from 'typia';
import { IErrorResponse } from '@src/shared/types/response';
import { INVALID_LMS_SECRET } from '@src/core/error-code.constant';
import { Roles } from '@src/core/decorators/roles.decorator';
import { RolesGuard } from '@src/core/guards/roles.guard';
import { PromotionDashboardService } from '@src/v1/dashboard/promotion/promotion-dashboard.service';
import * as date from '@src/shared/utils/date';

@Controller('v1/dashboard/promotion')
export class PromotionDashboardController {
  constructor(
    private readonly promotionDashboardService: PromotionDashboardService,
  ) {}

  @TypedRoute.Post('/')
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
  @TypedException<IErrorResponse<INVALID_LMS_SECRET>>({
    status: INVALID_LMS_SECRET,
    description: 'invalid LMS api secret',
  })
  async createPromotion(
    @TypedHeaders() headers: AuthHeaders,
    @TypedBody() body: CreatePromotionPageDto,
  ): Promise<PromotionPageDto> {
    const promotionPage =
      await this.promotionDashboardService.createPromotionPage({
        promotionCreateParams: {
          ...body,
          openedAt: date.toDateOrNull(body.openedAt),
          closedAt: date.toDateOrNull(body.closedAt),
        },
        promotionContentCreateParams: body.contents,
      });

    return promotionPageToDto(promotionPage);
  }

  @TypedRoute.Patch('/:promotionId')
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
  @TypedException<IErrorResponse<INVALID_LMS_SECRET>>({
    status: INVALID_LMS_SECRET,
    description: 'invalid LMS api secret',
  })
  async updatePromotion(
    @TypedHeaders() headers: AuthHeaders,
    @TypedParam('promotionId') promotionId: PromotionDto['id'],
    @TypedBody() body: UpdatePromotionDto,
  ): Promise<PromotionPageDto> {
    const updatedPromotionPage =
      await this.promotionDashboardService.updatePromotionPage(
        { id: promotionId },
        {
          promotionUpdateParams: body.promotionUpdateParams
            ? {
                ...body.promotionUpdateParams,
                openedAt: date.toDateOrNull(
                  body.promotionUpdateParams.openedAt,
                ),
                closedAt: date.toDateOrNull(
                  body.promotionUpdateParams.closedAt,
                ),
              }
            : undefined,
          promotionContentUpdateParams: body.contentsUpdateParams,
        },
      );

    return promotionPageToDto(updatedPromotionPage);
  }
}
