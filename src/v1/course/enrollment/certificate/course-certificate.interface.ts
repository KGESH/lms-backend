import { Uuid } from '@src/shared/types/primitive';
import { Optional } from '@src/shared/types/optional';

export type ICourseCertificate = {
  id: Uuid;
  enrollmentId: Uuid;
  createdAt: Date;
};

export type ICourseCertificateCreate = Omit<
  Optional<ICourseCertificate, 'id'>,
  'createdAt'
>;
