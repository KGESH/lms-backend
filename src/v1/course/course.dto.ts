import { ISO8601, Uuid } from '../../shared/types/primitive';
import { Pagination } from '../../shared/types/pagination';

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

export type CourseUpdateDto = Partial<CourseCreateDto>;

export type CourseQuery = Partial<Pagination>;
