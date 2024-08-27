import { Injectable } from '@nestjs/common';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import {
  IEbookReview,
  IEbookReviewCreate,
} from '@src/v1/review/ebook-review/ebook-review.interface';
import { dbSchema } from '@src/infra/db/schema';
import * as typia from 'typia';

@Injectable()
export class EbookReviewRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async createEbookReview(
    params: IEbookReviewCreate,
    db = this.drizzle.db,
  ): Promise<IEbookReview> {
    const [ebookReview] = await db
      .insert(dbSchema.ebookReviews)
      .values(typia.misc.clone(params))
      .returning();

    return ebookReview;
  }
}
