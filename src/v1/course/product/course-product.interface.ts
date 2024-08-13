import { Uuid } from '../../../shared/types/primitive';
import { Optional } from '../../../shared/types/optional';

export type ICourseProduct = {
  id: Uuid;
  courseId: Uuid;
};

export type ICourseProductCreate = Optional<ICourseProduct, 'id'>;
