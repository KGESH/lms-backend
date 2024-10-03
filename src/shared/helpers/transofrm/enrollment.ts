import * as date from '@src/shared/utils/date';
import { CourseEnrollmentDto } from '@src/v1/course/enrollment/course-enrollment.dto';
import { ICourseEnrollment } from '@src/v1/course/enrollment/course-enrollment.interface';

export const enrollmentToDto = (
  enrollment: ICourseEnrollment,
): CourseEnrollmentDto => {
  return {
    ...enrollment,
    createdAt: date.toISOString(enrollment.createdAt),
    validUntil: date.toIsoStringOrNull(enrollment.validUntil),
  };
};
