import { ISO8601, Uuid } from '@src/shared/types/primitive';

export type CourseCertificateDto = {
  id: Uuid;
  enrollmentId: Uuid;
  createdAt: ISO8601;
};
