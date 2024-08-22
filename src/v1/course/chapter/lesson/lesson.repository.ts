import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { dbSchema } from '@src/infra/db/schema';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import {
  ILesson,
  ILessonCreate,
  ILessonUpdate,
} from '@src/v1/course/chapter/lesson/lesson.interface';

@Injectable()
export class LessonRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async createLesson(
    params: ILessonCreate,
    db = this.drizzle.db,
  ): Promise<ILesson> {
    const [lesson] = await db
      .insert(dbSchema.lessons)
      .values(params)
      .returning();
    return lesson;
  }

  async updateLesson(
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

  async deleteLesson(
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
