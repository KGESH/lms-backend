import { Injectable } from '@nestjs/common';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import { dbSchema } from '@src/infra/db/schema';
import { ILessonContentHistory } from '@src/v1/course/chapter/lesson/lesson-content/history/lesson-content-history.interface';
import { and, eq } from 'drizzle-orm';

@Injectable()
export class LessonContentHistoryQueryRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async findLessonContentAccessHistory(
    where: Pick<ILessonContentHistory, 'userId' | 'lessonContentId'>,
  ): Promise<ILessonContentHistory | null> {
    const history =
      await this.drizzle.db.query.lessonContentAccessHistory.findFirst({
        where: and(
          eq(dbSchema.lessonContentAccessHistory.userId, where.userId),
          eq(
            dbSchema.lessonContentAccessHistory.lessonContentId,
            where.lessonContentId,
          ),
        ),
      });

    return history ?? null;
  }
}
