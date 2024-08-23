import { ISO8601, Uuid } from '@src/shared/types/primitive';
import { Pagination } from '@src/shared/types/pagination';

export type EbookDto = {
  id: Uuid;
  teacherId: Uuid;
  categoryId: Uuid;
  title: string;
  description: string;
  createdAt: ISO8601;
  updatedAt: ISO8601;
};

export type EbookCreateDto = Pick<
  EbookDto,
  'teacherId' | 'categoryId' | 'title' | 'description'
>;

export type EbookUpdateDto = Omit<Partial<EbookCreateDto>, 'teacherId'>;

export type EbookQuery = Partial<Pagination> &
  Partial<Pick<EbookDto, 'categoryId'>>;
