import { Injectable } from '@nestjs/common';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import {
  IMockReviewUser,
  IMockReviewUserCreate,
} from '@src/v1/review/mock-review/mock-review-user.interface';
import { dbSchema } from '@src/infra/db/schema';

@Injectable()
export class MockReviewUserRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async createMockReviewUser(
    params: IMockReviewUserCreate,
    db = this.drizzle.db,
  ): Promise<IMockReviewUser> {
    const [mockReview] = await db
      .insert(dbSchema.mockReviewUsers)
      .values(params)
      .returning();

    return mockReview;
  }
}
