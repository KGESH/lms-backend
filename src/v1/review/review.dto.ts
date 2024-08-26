import {
  ISO8601,
  ProductType,
  UFloat,
  Uuid,
} from '@src/shared/types/primitive';
import { Pagination } from '@src/shared/types/pagination';

export type ReviewDto = {
  id: Uuid;
  userId: Uuid;
  orderId: Uuid | null;
  /**
   * 상품 타입. 'course' 또는 'ebook'.
   */
  productType: ProductType;
  createdAt: ISO8601;
  deletedAt: ISO8601 | null;
};

export type CreateReviewDto = Pick<ReviewDto, 'userId' | 'orderId'> & {
  /**
   * 리뷰 내용.
   */
  comment: string;
  /**
   * 리뷰 평점.
   */
  rating: UFloat;
};

export type ReviewSnapshotDto = {
  id: Uuid;
  reviewId: Uuid;
  /**
   * 리뷰 내용.
   */
  comment: string;
  /**
   * 리뷰 평점.
   */
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
  /**
   * 리뷰 댓글 내용.
   */
  comment: string;
  createdAt: ISO8601;
};

export type ReviewReplyWithSnapshotDto = ReviewReplyDto & {
  /**
   * 리뷰에 달린 댓글.
   */
  snapshot: ReviewReplySnapshotDto;
};

export type ReviewWithRelationsDto = ReviewDto & {
  /**
   * 구매자가 작성(수정)한 가장 최신 리뷰.
   */
  snapshot: ReviewSnapshotDto;
  /**
   * 구매자가 작성한 리뷰에 달린 댓글 목록.
   */
  replies: ReviewReplyWithSnapshotDto[];
};

export type ReviewQuery = Partial<Pagination>;
