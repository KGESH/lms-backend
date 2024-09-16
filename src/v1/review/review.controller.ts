import { Controller, UseGuards } from '@nestjs/common';
import {
  TypedBody,
  TypedException,
  TypedHeaders,
  TypedRoute,
} from '@nestia/core';
import { AuthHeaders } from '@src/v1/auth/auth.headers';
import {
  CreateReviewReplyDto,
  ReviewReplyWithSnapshotDto,
} from '@src/v1/review/review.dto';
import { reviewReplyToDto } from '@src/shared/helpers/transofrm/review';
import { ReviewReplyService } from '@src/v1/review/review-reply.service';
import { Roles } from '@src/core/decorators/roles.decorator';
import { RolesGuard } from '@src/core/guards/roles.guard';
import { TypeGuardError } from 'typia';
import { IErrorResponse } from '@src/shared/types/response';

@Controller('v1/review')
export class ReviewController {
  constructor(private readonly reviewReplyService: ReviewReplyService) {}

  /**
   * 리뷰에 대한 답글을 생성합니다.
   *
   * @tag review
   * @summary 리뷰 답글 생성
   */
  @TypedRoute.Post('/reply')
  @Roles('admin', 'manager', 'teacher')
  @UseGuards(RolesGuard)
  @TypedException<TypeGuardError>({
    status: 400,
    description: 'invalid request',
  })
  @TypedException<IErrorResponse<403>>({
    status: 403,
    description: 'Not enough [role] to access this resource.',
  })
  async createReviewReply(
    @TypedHeaders() headers: AuthHeaders,
    @TypedBody() body: CreateReviewReplyDto,
  ): Promise<ReviewReplyWithSnapshotDto> {
    const reply = await this.reviewReplyService.createReviewReply({
      replyCreateParams: {
        ...body,
      },
      snapshotCreateParams: {
        ...body,
      },
    });

    return reviewReplyToDto(reply);
  }
}
