import { Injectable } from '@nestjs/common';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import { dbSchema } from '@src/infra/db/schema';
import { and, eq } from 'drizzle-orm';
import { IEbookContentHistory } from '@src/v1/ebook/ebook-content/history/ebook-content-history.interface';

@Injectable()
export class EbookContentHistoryQueryRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async findEbookContentAccessHistory(
    where: Pick<IEbookContentHistory, 'userId' | 'ebookContentId'>,
  ): Promise<IEbookContentHistory | null> {
    const history =
      await this.drizzle.db.query.ebookContentAccessHistory.findFirst({
        where: and(
          eq(dbSchema.ebookContentAccessHistory.userId, where.userId),
          eq(
            dbSchema.ebookContentAccessHistory.ebookContentId,
            where.ebookContentId,
          ),
        ),
      });

    return history ?? null;
  }
}
