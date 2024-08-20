import { UInt } from './primitive';

export type Pagination = {
  page: UInt;
  pageSize: number;
  orderBy: 'asc' | 'desc';
};
