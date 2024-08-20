import * as date from '../../utils/date';
import { IReviewWithRelations } from '../../../v1/review/review.interface';
import { ReviewWithRelationsDto } from '../../../v1/review/review.dto';

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
      replies: review.snapshot.replies.map((reply) => ({
        ...reply,
        createdAt: date.toISOString(reply.createdAt),
        deletedAt: reply.deletedAt ? date.toISOString(reply.deletedAt) : null,
        snapshot: {
          ...reply.snapshot,
          createdAt: date.toISOString(reply.snapshot.createdAt),
        },
      })),
    },
  };
};
