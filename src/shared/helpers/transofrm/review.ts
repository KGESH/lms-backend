import * as date from '@src/shared/utils/date';
import {
  IReviewReplyWithSnapshot,
  IReviewWithRelations,
} from '@src/v1/review/review.interface';
import {
  ReviewReplyWithSnapshotDto,
  ReviewWithRelationsDto,
} from '@src/v1/review/review.dto';

export const reviewToDto = (
  review: IReviewWithRelations,
): ReviewWithRelationsDto => {
  return {
    ...review,
    createdAt: date.toISOString(review.createdAt),
    deletedAt: review.deletedAt ? date.toISOString(review.deletedAt) : null,
    snapshot: {
      ...review.snapshot,
      createdAt: date.toISOString(review.snapshot.createdAt),
    },
    replies: review.replies.map((reply) => ({
      ...reply,
      createdAt: date.toISOString(reply.createdAt),
      deletedAt: reply.deletedAt ? date.toISOString(reply.deletedAt) : null,
      snapshot: {
        ...reply.snapshot,
        createdAt: date.toISOString(reply.snapshot.createdAt),
      },
    })),
  };
};

export const reviewReplyToDto = (
  reply: IReviewReplyWithSnapshot,
): ReviewReplyWithSnapshotDto => {
  return {
    ...reply,
    createdAt: date.toISOString(reply.createdAt),
    deletedAt: reply.deletedAt ? date.toISOString(reply.deletedAt) : null,
    snapshot: {
      ...reply.snapshot,
      createdAt: date.toISOString(reply.snapshot.createdAt),
    },
  };
};
