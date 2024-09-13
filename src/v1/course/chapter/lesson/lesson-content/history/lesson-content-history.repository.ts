import { Injectable } from '@nestjs/common';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import { dbSchema } from '@src/infra/db/schema';
import { ILessonContentHistoryCreate } from '@src/v1/course/chapter/lesson/lesson-content/history/lesson-content-history.interface';

@Injectable()
export class LessonContentHistoryRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async createLessonContentHistory(
    params: ILessonContentHistoryCreate,
    db = this.drizzle.db,
  ) {
    const [history] = await db
      .insert(dbSchema.lessonContentAccessHistory)
      .values(params)
      .returning();

    return history;
  }
}
