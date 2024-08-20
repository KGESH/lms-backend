import { Injectable, NotFoundException } from '@nestjs/common';
import { ILessonContent } from './lesson-content.interface';
import { eq } from 'drizzle-orm';
import { DrizzleService } from '../../../../../infra/db/drizzle.service';
import { dbSchema } from '../../../../../infra/db/schema';

@Injectable()
export class LessonContentQueryRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async findOne(
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

  async findOneOrThrow(
    where: Pick<ILessonContent, 'id'>,
  ): Promise<ILessonContent> {
    const lessonContent = await this.findOne(where);

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
