import { ProductType, UFloat, Uuid } from '@src/shared/types/primitive';
import { Optional } from '@src/shared/types/optional';
import { IUserWithoutPassword } from '@src/v1/user/user.interface';
import { ICourseWithRelations } from '@src/v1/course/course-with-relations.interface';
import { IEbookWithRelations } from '@src/v1/ebook/ebook-with-relations.interface';

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

export type IReviewReplyWithRelations = IReviewReply & {
  user: IUserWithoutPassword;
  snapshot: IReviewReplySnapshot;
};

export type IReviewWithRelations = IReview & {
  user: IUserWithoutPassword;
  snapshot: IReviewSnapshot;
  replies: IReviewReplyWithRelations[];
  product:
    | Omit<ICourseWithRelations, 'chapters'>
    | Omit<IEbookWithRelations, 'contents'>;
};
