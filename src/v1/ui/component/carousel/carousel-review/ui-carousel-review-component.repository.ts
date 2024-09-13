import { Injectable } from '@nestjs/common';
import { eq, inArray } from 'drizzle-orm';
import { dbSchema } from '@src/infra/db/schema';
import { createUuid } from '@src/shared/utils/uuid';
import {
  IUiCarouselReview,
  IUiCarouselReviewCreate,
  IUiCarouselReviewUpdate,
} from '@src/v1/ui/component/carousel/carousel-review/ui-carousel-review.interface';
import { DrizzleService } from '@src/infra/db/drizzle.service';

@Injectable()
export class UiCarouselReviewComponentRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async create(
    params: IUiCarouselReviewCreate,
    db = this.drizzle.db,
  ): Promise<IUiCarouselReview> {
    const id = createUuid();
    const [uiCarouselReview] = await db
      .insert(dbSchema.uiCarouselReviews)
      .values({
        id,
        uiCarouselId: params.uiCarouselId,
        sequence: params.sequence,
        title: params.title,
        content: params.content,
        rating: params.rating,
      })
      .returning();

    return {
      id: uiCarouselReview.id,
      uiCarouselId: uiCarouselReview.uiCarouselId,
      sequence: uiCarouselReview.sequence,
      title: uiCarouselReview.title,
      content: uiCarouselReview.content,
      rating: uiCarouselReview.rating,
    };
  }

  async createMany(
    params: IUiCarouselReviewCreate[],
    db = this.drizzle.db,
  ): Promise<IUiCarouselReview[]> {
    if (params.length <= 0) {
      return [];
    }

    const uiCarouselReviews = await db
      .insert(dbSchema.uiCarouselReviews)
      .values(
        params.map((param) => ({
          id: createUuid(),
          uiCarouselId: param.uiCarouselId,
          sequence: param.sequence,
          title: param.title,
          content: param.content,
          rating: param.rating,
        })),
      )
      .returning();

    return uiCarouselReviews.map((uiCarouselReview) => ({
      id: uiCarouselReview.id,
      uiCarouselId: uiCarouselReview.uiCarouselId,
      sequence: uiCarouselReview.sequence,
      title: uiCarouselReview.title,
      content: uiCarouselReview.content,
      rating: uiCarouselReview.rating,
    }));
  }

  async updateUiCarouselReview(
    where: Pick<IUiCarouselReview, 'id'>,
    params: Omit<IUiCarouselReviewUpdate, 'id'>,
    db = this.drizzle.db,
  ): Promise<IUiCarouselReview> {
    const [updated] = await db
      .update(dbSchema.uiCarouselReviews)
      .set(params)
      .where(eq(dbSchema.uiCarouselReviews.id, where.id))
      .returning();

    return updated;
  }

  async deleteManyUiCarouselReviews(
    ids: IUiCarouselReview['id'][],
    db = this.drizzle.db,
  ): Promise<IUiCarouselReview[]> {
    const uiCarouselReviews = await db
      .delete(dbSchema.uiCarouselReviews)
      .where(inArray(dbSchema.uiCarouselReviews.id, ids))
      .returning();

    return uiCarouselReviews.map((uiCarouselReview) => ({
      id: uiCarouselReview.id,
      uiCarouselId: uiCarouselReview.uiCarouselId,
      sequence: uiCarouselReview.sequence,
      title: uiCarouselReview.title,
      content: uiCarouselReview.content,
      rating: uiCarouselReview.rating,
    }));
  }
}
