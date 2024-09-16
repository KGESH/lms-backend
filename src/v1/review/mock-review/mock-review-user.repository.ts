import { Injectable } from '@nestjs/common';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import {
  IMockReviewUser,
  IMockReviewUserCreate,
  IMockReviewUserUpdate,
} from '@src/v1/review/mock-review/mock-review-user.interface';
import { dbSchema } from '@src/infra/db/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class MockReviewUserRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async createMockReviewUser(
    params: IMockReviewUserCreate,
    db = this.drizzle.db,
  ): Promise<IMockReviewUser> {
    const [mockReviewUser] = await db
      .insert(dbSchema.mockReviewUsers)
      .values(params)
      .returning();

    return mockReviewUser;
  }

  async updateMockReviewUser(
    where: Pick<IMockReviewUser, 'id'>,
    params: IMockReviewUserUpdate,
    db = this.drizzle.db,
  ): Promise<IMockReviewUser> {
    const [updatedUser] = await db
      .update(dbSchema.mockReviewUsers)
      .set(params)
      .where(eq(dbSchema.mockReviewUsers.id, where.id))
      .returning();

    return updatedUser;
  }
}
