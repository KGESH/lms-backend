import { Uuid } from '../../shared/types/primitive';

export type ICourse = {
  id: Uuid;
  teacherId: Uuid;
  categoryId: Uuid;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
};

export type ICourseCreate = Pick<
  ICourse,
  'teacherId' | 'title' | 'description' | 'categoryId'
>;
