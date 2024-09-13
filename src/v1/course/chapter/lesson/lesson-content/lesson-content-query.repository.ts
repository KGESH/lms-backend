import { Injectable, NotFoundException } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import { dbSchema } from '@src/infra/db/schema';
import { ILessonContent } from '@src/v1/course/chapter/lesson/lesson-content/lesson-content.interface';

@Injectable()
export class LessonContentQueryRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async findLessonContent(
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

  async findLessonContentOrThrow(
    where: Pick<ILessonContent, 'id'>,
  ): Promise<ILessonContent> {
    const lessonContent = await this.findLessonContent(where);

    if (!lessonContent) {
      throw new NotFoundException('LessonContent not found');
    }

    return lessonContent;
  }

  async findManyByLessonId(
    where: Pick<ILessonContent, 'lessonId'>,
  ): Promise<ILessonContent[]> {
    return await this.drizzle.db.query.lessonContents.findMany({
      where: eq(dbSchema.lessonContents.lessonId, where.lessonId),
    });
  }
}
