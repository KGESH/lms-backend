import { Uuid } from './primitive';

export type IPagination = {
  cursor: Uuid | null;
  pageSize: number;
  orderBy: 'asc' | 'desc';
};
