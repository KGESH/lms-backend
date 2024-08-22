import { Uuid } from '@src/shared/types/primitive';
import { Optional } from '@src/shared/types/optional';

export type ICourseProduct = {
  id: Uuid;
  courseId: Uuid;
};

export type ICourseProductCreate = Optional<ICourseProduct, 'id'>;
