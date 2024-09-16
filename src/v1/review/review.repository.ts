import { Injectable, NotFoundException } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { dbSchema } from '@src/infra/db/schema';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import { IReview, IReviewCreate } from '@src/v1/review/review.interface';
import * as typia from 'typia';
import * as date from '@src/shared/utils/date';
import { IDeleteEntityMetadata } from '@src/core/delete-entity-metadata.interface';

@Injectable()
export class ReviewRepository {
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

  async createReview(
    params: IReviewCreate,
    db = this.drizzle.db,
  ): Promise<IReview> {
    const [review] = await db
      .insert(dbSchema.reviews)
      .values(typia.misc.clone(params))
      .returning();

    return review;
  }

  async deleteReview(
    where: Pick<IReview, 'id'>,
    metadata?: IDeleteEntityMetadata,
    db = this.drizzle.db,
  ): Promise<Pick<IReview, 'id'>> {
    const [softDeleted] = await db
      .update(dbSchema.reviews)
      .set({
        ...metadata,
        deletedAt: metadata?.deletedAt ?? date.now('date'),
      })
      .where(eq(dbSchema.reviews.id, where.id))
      .returning();

    return { id: softDeleted.id };
  }
}
