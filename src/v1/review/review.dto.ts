import {
  ISO8601,
  ProductType,
  UFloat,
  Uuid,
} from '@src/shared/types/primitive';
import { Pagination } from '@src/shared/types/pagination';
import { UserWithoutPasswordDto } from '@src/v1/user/user.dto';
import { EbookWithRelationsDto } from '@src/v1/ebook/ebook-with-relations.dto';
import { CourseWithRelationsDto } from '@src/v1/course/course-with-relations.dto';
import { Optional, OptionalPick } from '@src/shared/types/optional';

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

export type CreateReviewDto = {
  /**
   * 리뷰 내용.
   */
  comment: string;

  /**
   * 리뷰 평점.
   */
  rating: UFloat;
};

export type UpdateReviewDto = Partial<CreateReviewDto> & {
  /**
   * 리뷰 ID.
   */
  reviewId: Uuid;
};

export type DeleteReviewDto = { reviewId: Uuid };

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

export type CreateReviewReplyDto = Pick<ReviewReplyDto, 'reviewId' | 'userId'> &
  Pick<ReviewReplySnapshotDto, 'comment'>;

export type ReviewReplyWithSnapshotDto = ReviewReplyDto & {
  /**
   * 리뷰에 달린 댓글.
   */
  snapshot: ReviewReplySnapshotDto;

  /**
   * 댓글 작성자.
   */
  user: UserWithoutPasswordDto;
};

export type ReviewWithRelationsDto = ReviewDto & {
  /**
   * 리뷰를 작성한 사용자.
   */
  user: UserWithoutPasswordDto;

  /**
   * 구매한 상품 정보.
   */
  product:
    | Omit<EbookWithRelationsDto, 'contents'>
    | Omit<CourseWithRelationsDto, 'chapters'>;

  /**
   * 구매자가 작성(수정)한 가장 최신 리뷰.
   */
  snapshot: ReviewSnapshotDto;

  /**
   * 구매자가 작성한 리뷰에 달린 댓글 목록.
   */
  replies: ReviewReplyWithSnapshotDto[];
};

export type ReviewQuery = Partial<Pagination> &
  OptionalPick<ReviewDto, 'userId'>;
