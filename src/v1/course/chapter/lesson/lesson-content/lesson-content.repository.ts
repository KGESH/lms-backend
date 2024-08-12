import { Injectable, NotFoundException } from '@nestjs/common';
import {
  ILessonContent,
  ILessonContentCreate,
} from './lesson-content.interface';
import { asc, desc, eq, gt } from 'drizzle-orm';
import { IRepository } from '../../../../../core/base.repository';
import { DrizzleService } from '../../../../../infra/db/drizzle.service';
import { dbSchema } from '../../../../../infra/db/schema';
import { IPagination } from '../../../../../shared/types/pagination';
import {
  DEFAULT_CURSOR,
  DEFAULT_ORDER_BY,
  DEFAULT_PAGE_SIZE,
} from '../../../../../core/pagination.constant';

@Injectable()
export class LessonContentRepository implements IRepository<ILessonContent> {
  constructor(private readonly drizzle: DrizzleService) {}

  async findOne(
    where: Pick<ILessonContent, 'id'>,
  ): Promise<ILessonContent | null> {
    const lessonContent = await this.drizzle.db.query.lessonContents.findFirst({
      where: eq(dbSchema.lessonContents.id, where.id),
    });

    if (!lessonContent) {
      return null;
    }

    return lessonContent;
  }

  async findOneOrThrow(
    where: Pick<ILessonContent, 'id'>,
  ): Promise<ILessonContent> {
    const lessonContent = await this.findOne(where);

    if (!lessonContent) {
      throw new NotFoundException('LessonContent not found');
    }

    return lessonContent;
  }

  async findMany(
    pagination: IPagination = {
      cursor: DEFAULT_CURSOR,
      pageSize: DEFAULT_PAGE_SIZE,
      orderBy: DEFAULT_ORDER_BY,
    },
  ): Promise<ILessonContent[]> {
    return await this.drizzle.db
      .select()
      .from(dbSchema.lessonContents)
      .where(
        pagination.cursor
          ? gt(dbSchema.lessonContents.id, pagination.cursor)
          : undefined,
      )
      .limit(pagination.pageSize)
      .orderBy(
        pagination.orderBy === 'asc'
          ? asc(dbSchema.lessonContents.id)
          : desc(dbSchema.lessonContents.id),
      );
  }

  async create(
    params: ILessonContentCreate,
    db = this.drizzle.db,
  ): Promise<ILessonContent> {
    const [lessonContent] = await db
      .insert(dbSchema.lessonContents)
      .values(params)
      .returning();
    return lessonContent;
  }

  async update(
    where: Pick<ILessonContent, 'id'>,
    params: Partial<ILessonContent>,
    db = this.drizzle.db,
  ): Promise<ILessonContent> {
    const [updated] = await db
      .update(dbSchema.lessonContents)
      .set(params)
      .where(eq(dbSchema.lessonContents.id, where.id))
      .returning();
    return updated;
  }

  async delete(
    where: Pick<ILessonContent, 'id'>,
    db = this.drizzle.db,
  ): Promise<ILessonContent> {
    const [deleted] = await db
      .delete(dbSchema.lessonContents)
      .where(eq(dbSchema.lessonContents.id, where.id))
      .returning();
    return deleted;
  }
}
