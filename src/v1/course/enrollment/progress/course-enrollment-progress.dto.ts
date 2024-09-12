import { ISO8601, Uuid } from '@src/shared/types/primitive';
import { CourseCertificateDto } from '@src/v1/course/enrollment/certificate/course-certificate.dto';

export type CourseEnrollmentProgressDto = {
  id: Uuid;
  enrollmentId: Uuid;
  lessonId: Uuid;
  createdAt: ISO8601;
};

export type CourseEnrollmentLessonCompleteDto = {
  completed: CourseEnrollmentProgressDto;
  certificate: CourseCertificateDto | null;
};
