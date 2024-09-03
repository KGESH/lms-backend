import { Pagination } from '@src/shared/types/pagination';
import { DEFAULT_PAGINATION } from '@src/core/pagination.constant';

export const withDefaultPagination = (
  query: Partial<Pagination>,
): Pagination => {
  return {
    page: query.page ?? DEFAULT_PAGINATION.page,
    pageSize: query.pageSize || DEFAULT_PAGINATION.pageSize,
    orderBy: query.orderBy || DEFAULT_PAGINATION.orderBy,
  };
};
