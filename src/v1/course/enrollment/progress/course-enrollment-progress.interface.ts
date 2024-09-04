import { Uuid } from '@src/shared/types/primitive';
import { Optional } from '@src/shared/types/optional';

export type ICourseEnrollmentProgress = {
  id: Uuid;
  enrollmentId: Uuid;
  lessonId: Uuid;
  createdAt: Date;
};

export type ICourseEnrollmentProgressCreate = Optional<
  ICourseEnrollmentProgress,
  'id' | 'createdAt'
>;
