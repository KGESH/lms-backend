import { TransactionClient } from '../../../../../src/infra/db/drizzle.types';
import { dbSchema } from '../../../../../src/infra/db/schema';
import {
  IPromotion,
  IPromotionCreate,
} from '@src/v1/promotion/promotion.interface';

export const createPromotion = async (
  params: IPromotionCreate,
  db: TransactionClient,
): Promise<IPromotion> => {
  const [promotion] = await db
    .insert(dbSchema.promotions)
    .values(params)
    .returning();
  return promotion;
};
