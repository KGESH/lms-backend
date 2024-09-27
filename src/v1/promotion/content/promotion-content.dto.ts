import { PromotionContentType, UInt, Uuid } from '@src/shared/types/primitive';
import { RequiredField } from '@src/shared/types/required-field';

export type PromotionContentDto = {
  id: Uuid;
  promotionId: Uuid;
  fileId: Uuid | null;
  type: PromotionContentType;
  title: string;
  description: string | null;
  sequence: UInt;
};

export type CreatePromotionContentDto = Omit<PromotionContentDto, 'id'>;

export type UpdatePromotionContentDto = RequiredField<
  Partial<Omit<PromotionContentDto, 'promotionId'>>,
  'id'
>;
