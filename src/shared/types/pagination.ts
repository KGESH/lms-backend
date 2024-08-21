import { UInt } from './primitive';

export type Pagination = {
  page: UInt;
  pageSize: UInt;
  orderBy: 'asc' | 'desc';
};
