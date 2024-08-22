import * as date from '@src/shared/utils/date';
import { ICourseCertificate } from '@src/v1/course/enrollment/certificate/course-certificate.interface';
import { CourseCertificateDto } from '@src/v1/course/enrollment/certificate/course-certificate.dto';

export const certificateToDto = (
  certificate: ICourseCertificate,
): CourseCertificateDto => {
  return {
    ...certificate,
    createdAt: date.toISOString(certificate.createdAt),
  };
};
