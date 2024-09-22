import { Injectable } from '@nestjs/common';
import { dbSchema } from '@src/infra/db/schema';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import { IUiCarouselContent } from '@src/v1/ui/component/carousel/carousel-content/ui-carousel-content.interface';
import { eq } from 'drizzle-orm';

@Injectable()
export class UiCarouselContentQueryRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async findUiCarouselContent(
    where: Pick<IUiCarouselContent, 'id'>,
  ): Promise<IUiCarouselContent | null> {
    const carouselContent =
      await this.drizzle.db.query.uiCarouselContents.findFirst({
        where: eq(dbSchema.uiCarouselContents.id, where.id),
      });

    return carouselContent ?? null;
  }
}
