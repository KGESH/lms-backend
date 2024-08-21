import {
  ISO8601,
  ProductType,
  UFloat,
  Uuid,
} from '../../shared/types/primitive';
import { Pagination } from '../../shared/types/pagination';

export type ReviewDto = {
  id: Uuid;
  userId: Uuid;
  orderId: Uuid | null;
  productType: ProductType;
  createdAt: ISO8601;
  deletedAt: ISO8601 | null;
};

export type CreateReviewDto = Pick<ReviewDto, 'userId' | 'orderId'> & {
  comment: string;
  rating: UFloat;
};

export type ReviewSnapshotDto = {
  id: Uuid;
  reviewId: Uuid;
  comment: string;
  rating: UFloat;
  createdAt: ISO8601;
};

export type ReviewReplyDto = {
  id: Uuid;
  reviewId: Uuid;
  userId: Uuid;
  parentId: Uuid | null;
  createdAt: ISO8601;
  deletedAt: ISO8601 | null;
};

export type ReviewReplySnapshotDto = {
  id: Uuid;
  reviewReplyId: Uuid;
  comment: string;
  createdAt: ISO8601;
};

export type ReviewReplyWithSnapshotDto = ReviewReplyDto & {
  snapshot: ReviewReplySnapshotDto;
};

export type ReviewWithRelationsDto = ReviewDto & {
  snapshot: ReviewSnapshotDto;
  replies: ReviewReplyWithSnapshotDto[];
};

export type ReviewQuery = Pick<ReviewDto, 'productType'> & Partial<Pagination>;
