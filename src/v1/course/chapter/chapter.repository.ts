import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { dbSchema } from '@src/infra/db/schema';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import {
  IChapter,
  IChapterCreate,
  IChapterUpdate,
} from '@src/v1/course/chapter/chapter.interface';

@Injectable()
export class ChapterRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async createChapter(
    params: IChapterCreate,
    db = this.drizzle.db,
  ): Promise<IChapter> {
    const [chapter] = await db
      .insert(dbSchema.chapters)
      .values(params)
      .returning();
    return chapter;
  }

  async updateChapter(
    where: Pick<IChapter, 'id'>,
    params: IChapterUpdate,
    db = this.drizzle.db,
  ): Promise<IChapter> {
    const [updated] = await db
      .update(dbSchema.chapters)
      .set(params)
      .where(eq(dbSchema.chapters.id, where.id))
      .returning();
    return updated;
  }

  async deleteChapter(
    where: Pick<IChapter, 'id'>,
    db = this.drizzle.db,
  ): Promise<IChapter> {
    const [deleted] = await db
      .delete(dbSchema.chapters)
      .where(eq(dbSchema.chapters.id, where.id))
      .returning();
    return deleted;
  }
}
