import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import { dbSchema } from '@src/infra/db/schema';
import {
  ILessonContent,
  ILessonContentCreate,
  ILessonContentUpdate,
} from '@src/v1/course/chapter/lesson/lesson-content/lesson-content.interface';

@Injectable()
export class LessonContentRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async createLessonContents(
    params: ILessonContentCreate[],
    db = this.drizzle.db,
  ): Promise<ILessonContent[]> {
    const lessonContents = await db
      .insert(dbSchema.lessonContents)
      .values(params)
      .returning();

    return lessonContents;
  }

  async updateLessonContent(
    where: Pick<ILessonContent, 'id'>,
    params: ILessonContentUpdate,
    db = this.drizzle.db,
  ): Promise<ILessonContent> {
    const [updated] = await db
      .update(dbSchema.lessonContents)
      .set(params)
      .where(eq(dbSchema.lessonContents.id, where.id))
      .returning();

    return updated;
  }

  async deleteLessonContent(
    where: Pick<ILessonContent, 'id'>,
    db = this.drizzle.db,
  ): Promise<ILessonContent['id']> {
    await db
      .delete(dbSchema.lessonContents)
      .where(eq(dbSchema.lessonContents.id, where.id));

    return where.id;
  }
}
