import { EMail, UserRole, Uuid } from '@src/shared/types/primitive';

export type IMockReviewUser = {
  id: Uuid;
  reviewId: Uuid;
  displayName: string;
  email: EMail;
  image: string | null;
  role: UserRole;
  emailVerified: Date | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
};

export type IMockReviewUserCreate = Pick<
  IMockReviewUser,
  'reviewId' | 'displayName' | 'email' | 'image'
>;
