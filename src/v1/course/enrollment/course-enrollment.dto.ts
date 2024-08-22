import { ISO8601, Uuid } from '@src/shared/types/primitive';

export type CourseEnrollmentDto = {
  id: Uuid;
  userId: Uuid;
  courseId: Uuid;
  createdAt: ISO8601;
};
