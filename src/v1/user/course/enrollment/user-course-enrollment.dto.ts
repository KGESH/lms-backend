import { CourseDto } from '@src/v1/course/course.dto';
import { CourseEnrollmentDto } from '@src/v1/course/enrollment/course-enrollment.dto';
import { CourseCertificateDto } from '@src/v1/course/enrollment/certificate/course-certificate.dto';

export type CourseEnrollmentCertificateDto = {
  course: CourseDto;
  enrollment: CourseEnrollmentDto;
  certificate: CourseCertificateDto | null;
};
