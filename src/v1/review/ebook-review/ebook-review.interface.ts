import { UFloat, Uuid } from '@src/shared/types/primitive';
import { Optional } from '@src/shared/types/optional';

export type IEbookReview = {
  id: Uuid;
  reviewId: Uuid;
  ebookId: Uuid;
  createdAt: Date;
  deletedAt: Date | null;
};

export type IEbookReviewCreate = Pick<
  Optional<IEbookReview, 'id'>,
  'id' | 'ebookId' | 'reviewId' | 'createdAt'
>;

export type IEbookReviewRelationsCreate = {
  ebookId: Uuid;
  userId: Uuid;
  comment: string;
  rating: UFloat;
};
