import { Injectable } from '@nestjs/common';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import {
  IEbook,
  IEbookCreate,
  IEbookUpdate,
} from '@src/v1/ebook/ebook.interface';
import { eq } from 'drizzle-orm';
import { dbSchema } from '@src/infra/db/schema';

@Injectable()
export class EbookRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async createEbook(params: IEbookCreate, db = this.drizzle.db) {
    const [ebook] = await db.insert(dbSchema.ebooks).values(params).returning();
    return ebook;
  }

  async updateEbook(
    where: Pick<IEbook, 'id'>,
    params: IEbookUpdate,
    db = this.drizzle.db,
  ): Promise<IEbook> {
    const [updated] = await db
      .update(dbSchema.ebooks)
      .set(params)
      .where(eq(dbSchema.ebooks.id, where.id))
      .returning();
    return updated;
  }

  async deleteEbook(where: Pick<IEbook, 'id'>, db = this.drizzle.db) {
    const [deleted] = await db
      .delete(dbSchema.ebooks)
      .where(eq(dbSchema.ebooks.id, where.id))
      .returning();
    return deleted;
  }
}
