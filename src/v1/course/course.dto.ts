import { ISO8601, Uuid } from '@src/shared/types/primitive';
import { Pagination } from '@src/shared/types/pagination';

export type CourseDto = {
  id: Uuid;
  teacherId: Uuid;
  categoryId: Uuid;
  title: string;
  description: string;
  createdAt: ISO8601;
  updatedAt: ISO8601;
};

export type CourseCreateDto = Pick<
  CourseDto,
  'teacherId' | 'categoryId' | 'title' | 'description'
>;

export type CourseUpdateDto = Omit<Partial<CourseCreateDto>, 'teacherId'>;

export type CourseQuery = Partial<Pagination>;
