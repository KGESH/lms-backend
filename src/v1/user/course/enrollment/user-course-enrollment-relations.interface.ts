import { ICourseCertificate } from '@src/v1/course/enrollment/certificate/course-certificate.interface';
import { ICourseEnrollment } from '@src/v1/course/enrollment/course-enrollment.interface';
import { ICourseWithRelations } from '@src/v1/course/course-with-relations.interface';
import { ICourseEnrollmentProgress } from '@src/v1/course/enrollment/progress/course-enrollment-progress.interface';

export type ICourseEnrollmentCertificate = {
  course: ICourseWithRelations;
  // course: ICourse;
  enrollment: ICourseEnrollment;
  certificate: ICourseCertificate | null;
  progresses: ICourseEnrollmentProgress[];
};
