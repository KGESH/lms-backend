import { CourseEnrollmentDto } from '@src/v1/course/enrollment/course-enrollment.dto';
import { CourseCertificateDto } from '@src/v1/course/enrollment/certificate/course-certificate.dto';
import { CourseEnrollmentProgressDto } from '@src/v1/course/enrollment/progress/course-enrollment-progress.dto';
import { Uuid } from '@src/shared/types/primitive';
import { CourseWithRelationsDto } from '@src/v1/course/course-with-relations.dto';

export type CourseEnrollmentCertificateDto = {
  course: CourseWithRelationsDto;
  enrollment: CourseEnrollmentDto;
  certificate: CourseCertificateDto | null;
  progresses: CourseEnrollmentProgressDto[];
};

export type CompleteLessonDto = {
  courseId: Uuid;
  lessonId: Uuid;
};
