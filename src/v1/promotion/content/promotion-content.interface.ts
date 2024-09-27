import { PromotionContentType, UInt, Uuid } from '@src/shared/types/primitive';
import { RequiredField } from '@src/shared/types/required-field';

export type IPromotionContent = {
  id: Uuid;
  promotionId: Uuid;
  fileId: Uuid | null;
  type: PromotionContentType;
  title: string;
  description: string | null;
  sequence: UInt;
};

export type IPromotionContentCreate = Omit<IPromotionContent, 'id'>;

export type IPromotionContentUpdate = RequiredField<
  Partial<IPromotionContent>,
  'id'
>;
