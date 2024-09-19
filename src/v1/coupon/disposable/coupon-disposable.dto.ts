import { ISO8601, UInt, Uuid } from '@src/shared/types/primitive';
import { Pagination } from '@src/shared/types/pagination';

/**
 * 일회용 쿠폰 코드
 */
export type CouponDisposableDto = {
  /**
   * 발급된 일회용 쿠폰 ID
   */
  id: Uuid;

  /**
   * 쿠폰 ID
   */
  couponId: Uuid;

  /**
   * Unique한 일회용 쿠폰 코드
   */
  code: string;

  /**
   * 발급 일자
   */
  createdAt: ISO8601;

  /**
   * 만료 일자
   */
  expiredAt: ISO8601 | null;
};

export type CreateCouponDisposableDto = Pick<
  CouponDisposableDto,
  'expiredAt'
> & {
  count: UInt;
};

export type CouponDisposableQuery = Partial<Pagination> & {
  code?: string;
};
