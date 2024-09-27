import { ISO8601, Uuid } from '@src/shared/types/primitive';
import { Pagination } from '@src/shared/types/pagination';
import {
  CreatePromotionContentDto,
  PromotionContentDto,
  UpdatePromotionContentDto,
} from '@src/v1/promotion/content/promotion-content.dto';
import { CouponDto } from '@src/v1/coupon/coupon.dto';

export type PromotionDto = {
  id: Uuid;
  couponId: Uuid | null;
  title: string;
  description: string | null;
  openedAt: ISO8601 | null;
  closedAt: ISO8601 | null;
  createdAt: ISO8601;
  deletedAt: ISO8601 | null;
};

export type PromotionQuery = Partial<
  Pagination & {
    orderByColumn: keyof Pick<
      PromotionDto,
      'openedAt' | 'closedAt' | 'createdAt'
    >;
  }
>;

export type CreatePromotionDto = Omit<
  PromotionDto,
  'id' | 'createdAt' | 'deletedAt'
>;

export type CreatePromotionPageDto = CreatePromotionDto & {
  contents: Omit<CreatePromotionContentDto, 'promotionId'>[];
};

export type UpdatePromotionDto = {
  promotionUpdateParams?: Partial<CreatePromotionDto>;
  contentsUpdateParams?: UpdatePromotionContentDto[];
};

export type PromotionPageDto = PromotionDto & {
  coupon: CouponDto | null;
  contents: PromotionContentDto[];
};
