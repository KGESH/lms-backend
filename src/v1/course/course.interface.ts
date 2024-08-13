import { Uuid } from '../../shared/types/primitive';
import { Optional } from '../../shared/types/optional';

export type ICourse = {
  id: Uuid;
  teacherId: Uuid;
  categoryId: Uuid;
  title: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
};

export type ICourseCreate = Pick<
  Optional<ICourse, 'id'>,
  'id' | 'teacherId' | 'title' | 'description' | 'categoryId'
>;

export type ICourseUpdate = Omit<Partial<ICourseCreate>, 'id'>;
