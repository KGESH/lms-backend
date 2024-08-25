import { Injectable, NotFoundException } from '@nestjs/common';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import { IChapter } from '@src/v1/course/chapter/chapter.interface';
import { eq } from 'drizzle-orm';
import { dbSchema } from '@src/infra/db/schema';

@Injectable()
export class ChapterQueryRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async findChapter(where: Pick<IChapter, 'id'>): Promise<IChapter | null> {
    const chapter = await this.drizzle.db.query.chapters.findFirst({
      where: eq(dbSchema.chapters.id, where.id),
    });

    if (!chapter) {
      return null;
    }

    return chapter;
  }

  async findChapterOrThrow(where: Pick<IChapter, 'id'>): Promise<IChapter> {
    const chapter = await this.findChapter(where);

    if (!chapter) {
      throw new NotFoundException('Chapter not found');
    }

    return chapter;
  }

  async findChaptersByCourseId(
    where: Pick<IChapter, 'courseId'>,
  ): Promise<IChapter[]> {
    return await this.drizzle.db.query.chapters.findMany({
      where: eq(dbSchema.chapters.courseId, where.courseId),
    });
  }
}
