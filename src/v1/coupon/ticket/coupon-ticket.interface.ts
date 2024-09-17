import { Uuid } from '@src/shared/types/primitive';
import { Optional } from '@src/shared/types/optional';

/**
 * 발급된 쿠폰
 */
export type ICouponTicket = {
  /**
   * 발급된 쿠폰 ID
   */
  id: Uuid;

  /**
   * 쿠폰 ID
   */
  couponId: Uuid;

  /**
   * 사용자 ID
   */
  userId: Uuid;

  /**
   * 일회용 쿠폰 코드 ID
   */
  couponDisposableId: Uuid | null;

  /**
   * 발급 일자
   */
  createdAt: Date;

  /**
   * 만료 일자
   */
  expiredAt: Date | null;
};

export type ICouponTicketCreate = Optional<ICouponTicket, 'id'>;
