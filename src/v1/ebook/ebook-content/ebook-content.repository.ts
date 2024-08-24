import { Injectable } from '@nestjs/common';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import {
  IEbookContent,
  IEbookContentCreate,
} from '@src/v1/ebook/ebook-content/ebook-content.interface';
import { dbSchema } from '@src/infra/db/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class EbookContentRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async createEbookContents(
    params: IEbookContentCreate[],
    db = this.drizzle.db,
  ): Promise<IEbookContent[]> {
    const ebookContents = await db
      .insert(dbSchema.ebookContents)
      .values(params)
      .returning();
    return ebookContents;
  }

  async updateEbookContent(
    where: Pick<IEbookContent, 'id'>,
    params: IEbookContentCreate,
    db = this.drizzle.db,
  ): Promise<IEbookContent> {
    const [updated] = await db
      .update(dbSchema.ebookContents)
      .set(params)
      .where(eq(dbSchema.ebookContents.id, where.id))
      .returning();
    return updated;
  }

  async deleteEbookContent(
    where: Pick<IEbookContent, 'id'>,
    db = this.drizzle.db,
  ): Promise<IEbookContent> {
    const [deleted] = await db
      .delete(dbSchema.ebookContents)
      .where(eq(dbSchema.ebookContents.id, where.id))
      .returning();
    return deleted;
  }
}
