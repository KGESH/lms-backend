import { Injectable } from '@nestjs/common';
import { PromotionContentRepository } from '@src/v1/promotion/content/promotion-content.repository';
import { TransactionClient } from '@src/infra/db/drizzle.types';
import {
  IPromotionContent,
  IPromotionContentCreate, IPromotionContentUpdate
} from "@src/v1/promotion/content/promotion-content.interface";

@Injectable()
export class PromotionContentService {
  constructor(
    private readonly promotionContentRepository: PromotionContentRepository,
  ) {}

  async createManyPromotionContents(
    params: IPromotionContentCreate[],
    tx?: TransactionClient,
  ): Promise<IPromotionContent[]> {
    if (params.length === 0) {
      return [];
    }

    return await this.promotionContentRepository.createManyPromotionContent(
      params,
      tx,
    );
  }

  async updatePromotionContent(
    where: Pick<IPromotionContent, 'id'>,
    params: IPromotionContentUpdate,
    tx?: TransactionClient,
  ): Promise<IPromotionContent> {
    return await this.promotionContentRepository.updatePromotionContent(
      where,
      params,
      tx,
    );
  }

  async deletePromotionContent(
    where: Pick<IPromotionContent, 'id'>,
    tx?: TransactionClient,
  ): Promise<IPromotionContent['id']> {
    return await this.promotionContentRepository.deletePromotionContent(
      where,
      tx,
    );
  }
}
