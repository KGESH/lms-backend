import { Injectable } from '@nestjs/common';
import {
  ILessonContent,
  ILessonContentCreate,
} from './lesson-content.interface';
import { eq } from 'drizzle-orm';
import { DrizzleService } from '../../../../../infra/db/drizzle.service';
import { dbSchema } from '../../../../../infra/db/schema';

@Injectable()
export class LessonContentRepository {
  constructor(private readonly drizzle: DrizzleService) {}

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
