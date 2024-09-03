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

export type Paginated<TArray extends Array<unknown>> = {
  /**
   * paginated data.
   * 데이터 조회 결과입니다.
   */
  data: TArray;

  /**
   * pagination info.
   * 요청한 페이지네이션 정보입니다.
   */
  pagination: Pagination;

  /**
   * total count of database rows.
   * 데이터베이스에 저장된 전체 데이터의 개수입니다.
   */
  totalCount: UInt;
};
