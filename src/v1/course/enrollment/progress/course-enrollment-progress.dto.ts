import { ISO8601, Uuid } from '@src/shared/types/primitive';

export type CourseEnrollmentProgressDto = {
  id: Uuid;
  enrollmentId: Uuid;
  lessonId: Uuid;
  createdAt: ISO8601;
};
