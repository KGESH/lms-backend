import { Injectable } from '@nestjs/common';
import {
  IUiCarouselReview,
  IUiCarouselReviewCreate,
  IUiCarouselReviewUpdate,
} from './ui-carousel-review.interface';
import { DrizzleService } from '../../../../../infra/db/drizzle.service';
import { eq, inArray } from 'drizzle-orm';
import { dbSchema } from '../../../../../infra/db/schema';
import { createUuid } from '../../../../../shared/utils/uuid';

@Injectable()
export class UiCarouselReviewComponentRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  // async findOne(
  //   where: Pick<IUiCarouselReview, 'id'>,
  // ): Promise<IUiCarouselReview | null> {
  //   const uiCarouselReview =
  //     await this.drizzle.db.query.uiCarouselReviews.findFirst({
  //       where: eq(dbSchema.uiCarouselReviews.id, where.id),
  //       with: {},
  //     });
  //
  //   if (!uiCarouselReview) {
  //     return null;
  //   }
  //
  //   return {
  //     id: uiCarouselReview.id,
  //     uiCarouselId: uiCarouselReview.uiCarouselId,
  //     sequence: uiCarouselReview.sequence,
  //     title: uiCarouselReview.title,
  //     content: uiCarouselReview.content,
  //     rating: uiCarouselReview.rating,
  //   };
  // }
  //
  // async findOneOrThrow(
  //   where: Pick<IUiCarouselReview, 'id'>,
  // ): Promise<IUiCarouselReview> {
  //   const uiCarouselReview = await this.findOne(where);
  //
  //   if (!uiCarouselReview) {
  //     throw new NotFoundException('UiCarouselReview not found');
  //   }
  //
  //   return uiCarouselReview;
  // }

  // async findMany(pagination: Pagination): Promise<IUiCarouselReview[]> {
  //   const uiCarouselReviews =
  //     await this.drizzle.db.query.uiCarouselReviews.findMany({
  //       where: pagination.page
  //         ? gt(dbSchema.uiCarouselReviews.id, pagination.page)
  //         : undefined,
  //       orderBy:
  //         pagination.orderBy === 'asc'
  //           ? asc(dbSchema.uiCarouselReviews.id)
  //           : desc(dbSchema.uiCarouselReviews.id),
  //       limit: pagination.pageSize,
  //     });
  //
  //   return uiCarouselReviews.map((uiCarouselReview) => ({
  //     id: uiCarouselReview.id,
  //     uiCarouselId: uiCarouselReview.uiCarouselId,
  //     sequence: uiCarouselReview.sequence,
  //     title: uiCarouselReview.title,
  //     content: uiCarouselReview.content,
  //     rating: uiCarouselReview.rating,
  //   }));
  // }

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

  async update(
    where: Pick<IUiCarouselReview, 'id'>,
    params: IUiCarouselReviewUpdate,
    db = this.drizzle.db,
  ): Promise<IUiCarouselReview> {
    const [updated] = await db
      .update(dbSchema.uiCarouselReviews)
      .set(params)
      .where(eq(dbSchema.uiCarouselReviews.id, where.id))
      .returning();

    return {
      id: updated.id,
      uiCarouselId: updated.uiCarouselId,
      sequence: updated.sequence,
      title: updated.title,
      content: updated.content,
      rating: updated.rating,
    };
  }

  async delete(
    where: Pick<IUiCarouselReview, 'id'>,
    db = this.drizzle.db,
  ): Promise<IUiCarouselReview> {
    const [uiCarouselReview] = await db
      .delete(dbSchema.uiCarouselReviews)
      .where(eq(dbSchema.uiCarouselReviews.id, where.id))
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

  async deleteMany(
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
