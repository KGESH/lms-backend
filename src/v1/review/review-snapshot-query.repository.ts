import { Injectable, NotFoundException } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { dbSchema } from '@src/infra/db/schema';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import { IReview } from '@src/v1/review/review.interface';

@Injectable()
export class ReviewSnapshotQueryRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async findOne(where: Pick<IReview, 'id'>): Promise<IReview | null> {
    const review = await this.drizzle.db.query.reviews.findFirst({
      where: eq(dbSchema.reviews.id, where.id),
    });

    if (!review) {
      return null;
    }

    return review;
  }

  async findOneOrThrow(where: Pick<IReview, 'id'>): Promise<IReview> {
    const review = await this.findOne(where);

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    return review;
  }
}
