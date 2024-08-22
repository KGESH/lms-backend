import { ICourse } from '@src/v1/course/course.interface';
import { ICourseCertificate } from '@src/v1/course/enrollment/certificate/course-certificate.interface';
import { ICourseEnrollment } from '@src/v1/course/enrollment/course-enrollment.interface';

export type ICourseEnrollmentCertificate = {
  course: ICourse;
  enrollment: ICourseEnrollment;
  certificate: ICourseCertificate | null;
};
