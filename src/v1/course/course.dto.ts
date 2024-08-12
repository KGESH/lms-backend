import { Uuid } from '../../shared/types/primitive';

export type CourseDto = {
  id: Uuid;
  teacherId: Uuid;
  categoryId: Uuid;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
};

export type CourseCreateDto = Pick<
  CourseDto,
  'teacherId' | 'categoryId' | 'title' | 'description'
>;

export type CourseUpdateDto = Partial<CourseCreateDto>;
