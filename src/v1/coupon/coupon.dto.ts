import {
  DiscountType,
  DiscountValue,
  ISO8601,
  Uuid,
} from '@src/shared/types/primitive';

export type CouponDto = {
  /**
   * 쿠폰 ID
   */
  id: Uuid;

  /**
   * 쿠폰 이름
   */
  name: string;

  /**
   * 쿠폰 설명
   */
  description: string | null;

  /**
   * 할인 타입
   */
  discountType: DiscountType;

  /**
   * 할인 값. 할인 타입에 따라 의미가 달라집니다.
   */
  value: DiscountValue;

  /**
   * 구매 최소 금액. ex) 1000원 미만으로는 할인 적용 불가
   */
  threshold: number | null;

  /**
   * 쿠폰 최대 할인 금액. ex) 최대 할인 금액 20000원.
   */
  limit: number | null;

  /**
   * 쿠폰 만료 기간 ex) 발급일로부터 7일후 만료.
   */
  expiredIn: ISO8601 | null;

  /**
   * 쿠폰 만료 날짜 ex) 2024-01-01 23:59:59 만료.
   */
  expiredAt: ISO8601 | null;

  /**
   * 쿠폰 사용 가능 날짜 ex) 2024-12-25 00:00:00 부터 사용 가능.
   */
  openedAt: ISO8601 | null;

  /**
   * 쿠폰 사용 가능 날짜 ex) 2024-12-25 23:59:59 까지 사용 가능.
   */
  closedAt: ISO8601 | null;

  /**
   * 쿠폰 발급량. ex) 1000개 발급. null이면 무제한.
   * 수량 제한 발행 수량에 제한이 있으면 이 값을 초과하는 티켓 발행이 불가능해집니다.
   * 즉, 선착순으로 N개의 쿠폰이 발행되는 개념이 만들어집니다.
   */
  volume: number | null;

  /**
   * 1인당 발급 수량. ex) 1인당 N개 발급. null이면 무제한.
   */
  volumePerCitizen: number | null;
};

export type CouponRelationsDto = CouponDto & {
  // Todo: Impl
};
