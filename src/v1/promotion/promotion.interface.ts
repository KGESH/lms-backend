import { Uuid } from '@src/shared/types/primitive';
import { Pagination } from '@src/shared/types/pagination';
import { OptionalPick } from '@src/shared/types/optional';

export type IPromotion = {
  id: Uuid;
  couponId: Uuid | null;
  title: string;
  description: string | null;
  openedAt: Date | null;
  closedAt: Date | null;
  createdAt: Date;
  deletedAt: Date | null;
};

export type IPromotionCreate = Omit<
  IPromotion,
  'id' | 'createdAt' | 'deletedAt'
>;

export type IPromotionUpdate = OptionalPick<
  IPromotion,
  'couponId' | 'title' | 'description' | 'openedAt' | 'closedAt'
>;

export type IPromotionPagination = Pagination & {
  orderByColumn: keyof Pick<IPromotion, 'openedAt' | 'closedAt' | 'createdAt'>;
};
