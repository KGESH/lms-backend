import { Injectable } from '@nestjs/common';
import { PromotionRepository } from '@src/v1/promotion/promotion.repository';
import {
  IPromotion,
  IPromotionCreate,
  IPromotionUpdate,
} from '@src/v1/promotion/promotion.interface';
import { TransactionClient } from '@src/infra/db/drizzle.types';

@Injectable()
export class PromotionService {
  constructor(private readonly promotionRepository: PromotionRepository) {}

  async createPromotion(
    params: IPromotionCreate,
    tx?: TransactionClient,
  ): Promise<IPromotion> {
    return await this.promotionRepository.createPromotion(params, tx);
  }

  async updatePromotion(
    where: Pick<IPromotion, 'id'>,
    params: IPromotionUpdate,
    tx?: TransactionClient,
  ): Promise<IPromotion> {
    return await this.promotionRepository.updatePromotion(where, params, tx);
  }

  async deletePromotion(
    where: Pick<IPromotion, 'id'>,
    tx?: TransactionClient,
  ): Promise<IPromotion['id']> {
    return await this.promotionRepository.deletePromotion(where, tx);
  }
}
