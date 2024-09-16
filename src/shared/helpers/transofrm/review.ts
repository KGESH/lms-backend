import * as date from '@src/shared/utils/date';
import {
  IReviewReplyWithRelations,
  IReviewWithRelations,
} from '@src/v1/review/review.interface';
import {
  ReviewReplyWithSnapshotDto,
  ReviewWithRelationsDto,
} from '@src/v1/review/review.dto';
import { userToDto } from '@src/shared/helpers/transofrm/user';
import { ebookRelationsToDto } from '@src/shared/helpers/transofrm/ebook';
import { courseRelationsToDto } from '@src/shared/helpers/transofrm/course';

export const reviewToDto = (
  review: IReviewWithRelations,
): ReviewWithRelationsDto => {
  return {
    ...review,
    createdAt: date.toISOString(review.createdAt),
    deletedAt: review.deletedAt ? date.toISOString(review.deletedAt) : null,
    user: userToDto(review.user),
    snapshot: {
      ...review.snapshot,
      createdAt: date.toISOString(review.snapshot.createdAt),
    },
    replies: review.replies.map((reply) => ({
      ...reply,
      createdAt: date.toISOString(reply.createdAt),
      deletedAt: reply.deletedAt ? date.toISOString(reply.deletedAt) : null,
      user: userToDto(reply.user),
      snapshot: {
        ...reply.snapshot,
        createdAt: date.toISOString(reply.snapshot.createdAt),
      },
    })),
    product:
      review.productType === 'course'
        ? courseRelationsToDto({
            ...review.product,
            chapters: [],
          })
        : ebookRelationsToDto({
            ...review.product,
            contents: [],
          }),
  };
};

export const reviewReplyToDto = (
  reply: IReviewReplyWithRelations,
): ReviewReplyWithSnapshotDto => {
  return {
    ...reply,
    createdAt: date.toISOString(reply.createdAt),
    deletedAt: reply.deletedAt ? date.toISOString(reply.deletedAt) : null,
    user: userToDto(reply.user),
    snapshot: {
      ...reply.snapshot,
      createdAt: date.toISOString(reply.snapshot.createdAt),
    },
  };
};
