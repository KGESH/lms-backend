import { Injectable } from '@nestjs/common';
import { ReviewReplyRepository } from '@src/v1/review/review-reply.repository';
import {
  IReviewReplyCreate,
  IReviewReplySnapshotCreate,
  IReviewReplyWithRelations,
} from '@src/v1/review/review.interface';
import { ReviewReplySnapshotRepository } from '@src/v1/review/review-reply-snapshot.repository';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import { UserService } from '@src/v1/user/user.service';

@Injectable()
export class ReviewReplyService {
  constructor(
    private readonly userService: UserService,
    private readonly reviewReplyRepository: ReviewReplyRepository,
    private readonly reviewReplySnapshotRepository: ReviewReplySnapshotRepository,
    private readonly drizzle: DrizzleService,
  ) {}

  async createReviewReply({
    replyCreateParams,
    snapshotCreateParams,
  }: {
    replyCreateParams: IReviewReplyCreate;
    snapshotCreateParams: Omit<IReviewReplySnapshotCreate, 'reviewReplyId'>;
  }): Promise<IReviewReplyWithRelations> {
    const replyUser = await this.userService.findUserByIdOrThrow({
      id: replyCreateParams.userId,
    });

    const { reviewReply, snapshot } = await this.drizzle.db.transaction(
      async (tx) => {
        const reviewReply = await this.reviewReplyRepository.createReply(
          replyCreateParams,
          tx,
        );
        const snapshot =
          await this.reviewReplySnapshotRepository.createReplySnapshot(
            {
              ...snapshotCreateParams,
              reviewReplyId: reviewReply.id,
            },
            tx,
          );

        return { reviewReply, snapshot };
      },
    );

    return {
      ...reviewReply,
      snapshot,
      user: replyUser,
    };
  }
}
