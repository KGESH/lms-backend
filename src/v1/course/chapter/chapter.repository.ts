import { Injectable, NotFoundException } from '@nestjs/common';
import { DrizzleService } from '../../../infra/db/drizzle.service';
import { IChapter, IChapterCreate, IChapterUpdate } from './chapter.interface';
import { asc, desc, eq, gt } from 'drizzle-orm';
import { dbSchema } from '../../../infra/db/schema';
import { IRepository } from '../../../core/base.repository';
import { IPagination } from '../../../shared/types/pagination';
import {
  DEFAULT_CURSOR,
  DEFAULT_ORDER_BY,
  DEFAULT_PAGE_SIZE,
} from '../../../core/pagination.constant';

@Injectable()
export class ChapterRepository implements IRepository<IChapter> {
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

  async findMany(
    pagination: IPagination = {
      cursor: DEFAULT_CURSOR,
      pageSize: DEFAULT_PAGE_SIZE,
      orderBy: DEFAULT_ORDER_BY,
    },
  ): Promise<IChapter[]> {
    return await this.drizzle.db
      .select()
      .from(dbSchema.chapters)
      .where(
        pagination.cursor
          ? gt(dbSchema.chapters.id, pagination.cursor)
          : undefined,
      )
      .limit(pagination.pageSize)
      .orderBy(
        pagination.orderBy === 'asc'
          ? asc(dbSchema.chapters.id)
          : desc(dbSchema.chapters.id),
      );
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
