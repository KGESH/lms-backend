import { Uuid } from '../shared/types/primitive';

export type PaginationDto = {
  cursor: Uuid | null;
  pageSize: number;
  orderBy: 'asc' | 'desc';
};
