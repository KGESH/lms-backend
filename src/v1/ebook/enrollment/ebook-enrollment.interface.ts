import { Optional } from '@src/shared/types/optional';

export type IEbookEnrollment = {
  id: string;
  userId: string;
  ebookId: string;
  createdAt: Date;
};

export type IEbookEnrollmentCreate = Omit<
  Optional<IEbookEnrollment, 'id'>,
  'createdAt'
>;
