import { Uuid } from '@src/shared/types/primitive';
import { Optional } from '@src/shared/types/optional';

export type ICourseEnrollment = {
  id: Uuid;
  userId: Uuid;
  courseId: Uuid;
  createdAt: Date;
  validUntil: Date | null;
};

export type ICourseEnrollmentCreate = Omit<
  Optional<ICourseEnrollment, 'id'>,
  'createdAt'
>;
