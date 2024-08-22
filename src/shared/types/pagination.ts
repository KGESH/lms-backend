import { UInt } from './primitive';

export type Pagination = {
  /**
   * page offset.
   * default: 0
   */
  page: UInt;
  /**
   * item count.
   * default: 10
   */
  pageSize: UInt;
  /**
   * order by 'created_at'.
   * default: 'desc'.
   * Category API 호출시 정렬 기준이 ['created_at', 'desc']가 아닌 ['name', 'asc']로 설정됩니다.
   */
  orderBy: 'asc' | 'desc';
};
