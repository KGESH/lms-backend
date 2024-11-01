import { Controller } from '@nestjs/common';
import {
  TypedException,
  TypedHeaders,
  TypedParam,
  TypedQuery,
  TypedRoute,
} from '@nestia/core';
import { SkipAuth } from '@src/core/decorators/skip-auth.decorator';
import { PromotionQueryService } from '@src/v1/promotion/promotion-query.service';
import { PromotionService } from '@src/v1/promotion/promotion.service';
import {
  PromotionPageDto,
  PromotionQuery,
} from '@src/v1/promotion/promotion.dto';
import { ApiAuthHeaders } from '@src/v1/auth/auth.headers';
import { withDefaultPagination } from '@src/core/pagination';
import { promotionPageToDto } from '@src/shared/helpers/transofrm/promotion';
import { Paginated } from '@src/shared/types/pagination';
import { TypeGuardError } from 'typia';
import { IErrorResponse } from '@src/shared/types/response';
import { INVALID_LMS_SECRET } from '@src/core/error-code.constant';
import { Uuid } from '@src/shared/types/primitive';

@Controller('v1/promotion')
export class PromotionController {
  constructor(
    private readonly promotionService: PromotionService,
    private readonly promotionQueryService: PromotionQueryService,
  ) {}

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
  async getPromotions(
    @TypedHeaders() headers: ApiAuthHeaders,
    @TypedQuery() query: PromotionQuery,
  ): Promise<Paginated<PromotionPageDto[]>> {
    const {
      pagination,
      totalCount,
      data: promotions,
    } = await this.promotionQueryService.findManyPromotionsRelations({
      ...withDefaultPagination(query),
      orderByColumn: query.orderByColumn ?? 'createdAt',
    });

    return {
      totalCount,
      pagination,
      data: promotions.map(promotionPageToDto),
    };
  }

  @TypedRoute.Get('/:promotionId')
  @SkipAuth()
  @TypedException<TypeGuardError>({
    status: 400,
    description: 'invalid request',
  })
  @TypedException<IErrorResponse<INVALID_LMS_SECRET>>({
    status: INVALID_LMS_SECRET,
    description: 'invalid LMS api secret',
  })
  async getPromotion(
    @TypedHeaders() headers: ApiAuthHeaders,
    @TypedParam('promotionId') promotionId: Uuid,
  ): Promise<PromotionPageDto | null> {
    console.log('[getPromotion]', promotionId);
    const promotion = await this.promotionQueryService.findPromotionRelations({
      id: promotionId,
    });

    if (!promotion) {
      return null;
    }

    console.log('[getPromotion data]', JSON.stringify(promotion, null, 4));
    console.log(
      '[getPromotion dto data]',
      JSON.stringify(promotionPageToDto(promotion), null, 4),
    );
    return promotionPageToDto(promotion);
  }
}
