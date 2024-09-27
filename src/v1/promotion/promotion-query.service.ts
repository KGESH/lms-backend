import { Injectable, NotFoundException } from '@nestjs/common';
import {
  IPromotion,
  IPromotionPagination,
} from '@src/v1/promotion/promotion.interface';
import { PromotionQueryRepository } from '@src/v1/promotion/promotion-query.repository';
import { IPromotionRelations } from '@src/v1/promotion/promotion-relations.interface';
import { Paginated } from '@src/shared/types/pagination';

@Injectable()
export class PromotionQueryService {
  constructor(
    private readonly promotionQueryRepository: PromotionQueryRepository,
  ) {}

  async findManyPromotionsRelations(
    pagination: IPromotionPagination,
  ): Promise<Paginated<IPromotionRelations[]>> {
    return await this.promotionQueryRepository.findManyPromotionsRelations(
      pagination,
    );
  }

  async findPromotionRelations(
    where: Pick<IPromotion, 'id'>,
  ): Promise<IPromotionRelations | null> {
    return await this.promotionQueryRepository.findPromotionRelations(where);
  }

  async findPromotionRelationsOrThrow(
    where: Pick<IPromotion, 'id'>,
  ): Promise<IPromotionRelations> {
    const promotion = await this.findPromotionRelations(where);

    if (!promotion) {
      throw new NotFoundException('Promotion not found');
    }
    return promotion;
  }
}
