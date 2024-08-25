import { Injectable, NotFoundException } from '@nestjs/common';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import {
  IChapterSequenceUpdate,
  ILessonSequenceUpdate,
} from '@src/v1/dashboard/course/course-dashboard.interface';
import { SQL, inArray, sql } from 'drizzle-orm';
import { dbSchema } from '@src/infra/db/schema';
import { IChapter } from '@src/v1/course/chapter/chapter.interface';
import { ILesson } from '@src/v1/course/chapter/lesson/lesson.interface';

@Injectable()
export class CourseDashboardRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async updateChaptersSequence(
    params: IChapterSequenceUpdate[],
    db = this.drizzle.db,
  ): Promise<IChapter[]> {
    const itemCount = params.length;
    if (itemCount === 0) {
      return [];
    }

    const sqlChunks: SQL[] = [];
    const chapterIds = params.map((chapter) => chapter.id);

    sqlChunks.push(sql`(case`);
    for (const chapter of params) {
      sqlChunks.push(
        sql`when ${dbSchema.chapters.id} = ${chapter.id} then ${chapter.sequence}::integer`,
      );
      chapterIds.push(chapter.id);
    }
    sqlChunks.push(sql`end)`);

    const finalSql: SQL = sql.join(sqlChunks, sql.raw(' '));
    const updated = await db
      .update(dbSchema.chapters)
      .set({
        sequence: finalSql,
      })
      .where(inArray(dbSchema.chapters.id, chapterIds))
      .returning();

    if (updated.length !== itemCount) {
      throw new NotFoundException(
        'Failed to update chapters sequence. Requested item count and updated item count mismatch. Please check the request item "id" field and try again.',
      );
    }

    return updated;
  }

  async updateLessonsSequence(
    params: ILessonSequenceUpdate[],
    db = this.drizzle.db,
  ): Promise<ILesson[]> {
    const itemCount = params.length;
    if (itemCount === 0) {
      return [];
    }

    const sqlChunks: SQL[] = [];
    const lessonIds = params.map((lesson) => lesson.id);

    sqlChunks.push(sql`(case`);
    for (const lesson of params) {
      sqlChunks.push(
        sql`when ${dbSchema.lessons.id} = ${lesson.id} then ${lesson.sequence}::integer`,
      );
      lessonIds.push(lesson.id);
    }
    sqlChunks.push(sql`end)`);

    const finalSql: SQL = sql.join(sqlChunks, sql.raw(' '));
    const updated = await db
      .update(dbSchema.lessons)
      .set({
        sequence: finalSql,
      })
      .where(inArray(dbSchema.lessons.id, lessonIds))
      .returning();

    if (updated.length !== itemCount) {
      throw new NotFoundException(
        'Failed to update lessons sequence. Requested item count and updated item count mismatch. Please check the request item ID field and try again.',
      );
    }

    return updated;
  }
}
