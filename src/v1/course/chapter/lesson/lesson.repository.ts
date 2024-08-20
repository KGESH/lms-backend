import { Injectable } from '@nestjs/common';
import { DrizzleService } from '../../../../infra/db/drizzle.service';
import { ILesson, ILessonCreate, ILessonUpdate } from './lesson.interface';
import { eq } from 'drizzle-orm';
import { dbSchema } from '../../../../infra/db/schema';

@Injectable()
export class LessonRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async create(params: ILessonCreate, db = this.drizzle.db): Promise<ILesson> {
    const [lesson] = await db
      .insert(dbSchema.lessons)
      .values(params)
      .returning();
    return lesson;
  }

  async update(
    where: Pick<ILesson, 'id'>,
    params: ILessonUpdate,
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
