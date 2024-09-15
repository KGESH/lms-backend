import { EMail, Uuid } from '@src/shared/types/primitive';

export type MockReviewUserDto = {
  id: Uuid;
  reviewId: Uuid;
  displayName: string;
  email: EMail;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
};

export type CreateMockReviewUserDto = Pick<
  MockReviewUserDto,
  'displayName' | 'email' | 'image'
>;
