import { ISO8601, Uuid } from '../../shared/types/primitive';

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
