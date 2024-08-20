import { Injectable, NotFoundException } from '@nestjs/common';
import { DrizzleService } from '../../../infra/db/drizzle.service';
import { IChapter, IChapterCreate, IChapterUpdate } from './chapter.interface';
import { eq } from 'drizzle-orm';
import { dbSchema } from '../../../infra/db/schema';

@Injectable()
export class ChapterRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async findOne(where: Pick<IChapter, 'id'>): Promise<IChapter | null> {
    const chapter = await this.drizzle.db.query.chapters.findFirst({
      where: eq(dbSchema.chapters.id, where.id),
    });

    if (!chapter) {
      return null;
    }

    return chapter;
  }

  async findOneOrThrow(where: Pick<IChapter, 'id'>): Promise<IChapter> {
    const chapter = await this.findOne(where);

    if (!chapter) {
      throw new NotFoundException('Chapter not found');
    }

    return chapter;
  }

  async findManyByCourseId(
    where: Pick<IChapter, 'courseId'>,
  ): Promise<IChapter[]> {
    return await this.drizzle.db.query.chapters.findMany({
      where: eq(dbSchema.chapters.courseId, where.courseId),
    });
  }

  async create(
    params: IChapterCreate,
    db = this.drizzle.db,
  ): Promise<IChapter> {
    const [chapter] = await db
      .insert(dbSchema.chapters)
      .values(params)
      .returning();
    return chapter;
  }

  async update(
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

  async delete(
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
