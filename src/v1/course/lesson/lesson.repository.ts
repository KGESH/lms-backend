import { Injectable, NotFoundException } from '@nestjs/common';
import { DrizzleService } from '../../../infra/db/drizzle.service';
import { ILesson, ILessonCreate } from './lesson.interface';
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
export class LessonRepository implements IRepository<ILesson> {
  constructor(private readonly drizzle: DrizzleService) {}

  async findOne(where: Pick<ILesson, 'id'>): Promise<ILesson | null> {
    const lesson = await this.drizzle.db.query.lessons.findFirst({
      where: eq(dbSchema.lessons.id, where.id),
    });

    if (!lesson) {
      return null;
    }

    return lesson;
  }

  async findOneOrThrow(where: Pick<ILesson, 'id'>): Promise<ILesson> {
    const lesson = await this.findOne(where);

    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    return lesson;
  }

  async findMany(
    pagination: IPagination = {
      cursor: DEFAULT_CURSOR,
      pageSize: DEFAULT_PAGE_SIZE,
      orderBy: DEFAULT_ORDER_BY,
    },
  ): Promise<ILesson[]> {
    return await this.drizzle.db
      .select()
      .from(dbSchema.lessons)
      .where(
        pagination.cursor
          ? gt(dbSchema.lessons.id, pagination.cursor)
          : undefined,
      )
      .limit(pagination.pageSize)
      .orderBy(
        pagination.orderBy === 'asc'
          ? asc(dbSchema.lessons.id)
          : desc(dbSchema.lessons.id),
      );
  }

  async create(params: ILessonCreate, db = this.drizzle.db): Promise<ILesson> {
    const [lesson] = await db
      .insert(dbSchema.lessons)
      .values(params)
      .returning();
    return lesson;
  }

  async update(
    where: Pick<ILesson, 'id'>,
    params: Partial<ILesson>,
    db = this.drizzle.db,
  ): Promise<ILesson> {
    const [updated] = await db
      .update(dbSchema.lessons)
      .set(params)
      .where(eq(dbSchema.lessons.id, where.id))
      .returning();
    return updated;
  }

  async delete(
    where: Pick<ILesson, 'id'>,
    db = this.drizzle.db,
  ): Promise<ILesson> {
    const [deleted] = await db
      .delete(dbSchema.lessons)
      .where(eq(dbSchema.lessons.id, where.id))
      .returning();
    return deleted;
  }
}
