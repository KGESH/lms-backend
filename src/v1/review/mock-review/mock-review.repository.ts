import { Injectable } from '@nestjs/common';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import { eq } from 'drizzle-orm';
import { dbSchema } from '@src/infra/db/schema';
import { IReview } from '@src/v1/review/review.interface';
import { Uuid } from '@src/shared/types/primitive';

@Injectable()
export class MockReviewRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  // Cascade delete
  async deleteMockReview(
    where: Pick<IReview, 'id'>,
    db = this.drizzle.db,
  ): Promise<Uuid> {
    await db.delete(dbSchema.reviews).where(eq(dbSchema.reviews.id, where.id));
    return where.id;
  }
}
