import { Injectable } from '@nestjs/common';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import { dbSchema } from '@src/infra/db/schema';
import { IEbookContentHistoryCreate } from '@src/v1/ebook/ebook-content/history/ebook-content-history.interface';

@Injectable()
export class EbookContentHistoryRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async createEbookContentHistory(
    params: IEbookContentHistoryCreate,
    db = this.drizzle.db,
  ) {
    const [history] = await db
      .insert(dbSchema.ebookContentAccessHistory)
      .values(params)
      .returning();

    return history;
  }
}
