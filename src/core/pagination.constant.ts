import { Pagination } from '../shared/types/pagination';

export const DEFAULT_PAGE: Pagination['page'] = 1;

export const DEFAULT_PAGE_SIZE: Pagination['pageSize'] = 10;

export const DEFAULT_ORDER_BY: Pagination['orderBy'] = 'asc';

export const DEFAULT_PAGINATION: Pagination = {
  page: DEFAULT_PAGE,
  pageSize: DEFAULT_PAGE_SIZE,
  orderBy: DEFAULT_ORDER_BY,
};
