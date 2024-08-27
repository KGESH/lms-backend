import { ProductType, UFloat, Uuid } from '@src/shared/types/primitive';
import { Optional } from '@src/shared/types/optional';

export type IReview = {
  id: Uuid;
  userId: Uuid;
  orderId: Uuid | null;
  productType: ProductType;
  createdAt: Date;
  deletedAt: Date | null;
};

export type IReviewCreate = Pick<
  Optional<IReview, 'id'>,
  'id' | 'userId' | 'orderId' | 'productType'
>;

export type IReviewSnapshot = {
  id: Uuid;
  reviewId: Uuid;
  comment: string;
  rating: UFloat;
  createdAt: Date;
};

export type IReviewSnapshotCreate = Omit<
  Optional<IReviewSnapshot, 'id'>,
  'createdAt'
>;

export type IReviewReply = {
  id: Uuid;
  reviewId: Uuid;
  userId: Uuid;
  // parentId: Uuid | null;
  createdAt: Date;
  deletedAt: Date | null;
};

export type IReviewReplySnapshot = {
  id: Uuid;
  reviewReplyId: Uuid;
  comment: string;
  createdAt: Date;
};

export type IReviewReplyCreate = Pick<
  Optional<IReviewReply, 'id'>,
  'id' | 'reviewId' | 'userId'
>;

export type IReviewReplySnapshotCreate = Pick<
  Optional<IReviewReplySnapshot, 'id'>,
  'id' | 'reviewReplyId' | 'comment'
>;

export type IReviewReplyWithSnapshot = IReviewReply & {
  snapshot: IReviewReplySnapshot;
};

export type IReviewWithRelations = IReview & {
  snapshot: IReviewSnapshot;
  replies: IReviewReplyWithSnapshot[];
};
