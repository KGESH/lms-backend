import { Uuid } from '@src/shared/types/primitive';
import { Optional } from '@src/shared/types/optional';
import { Pagination } from '@src/shared/types/pagination';

export type IEbook = {
  id: Uuid;
  teacherId: Uuid;
  categoryId: Uuid;
  title: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
};

export type IEbookCreate = Pick<
  Optional<IEbook, 'id'>,
  'id' | 'teacherId' | 'title' | 'description' | 'categoryId'
>;

export type IEbookUpdate = Omit<Partial<IEbookCreate>, 'id' | 'teacherId'>;

export type IEbookQuery = Pagination & Partial<Pick<IEbook, 'categoryId'>>;
