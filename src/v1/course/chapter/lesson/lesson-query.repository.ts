import { Injectable, NotFoundException } from '@nestjs/common';
import { DrizzleService } from '../../../../infra/db/drizzle.service';
import { ILesson } from './lesson.interface';
import { eq } from 'drizzle-orm';
import { dbSchema } from '../../../../infra/db/schema';

@Injectable()
export class LessonQueryRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async findOne(where: Pick<ILesson, 'id'>): Promise<ILesson | null> {
    const lesson = await this.drizzle.db.query.lessons.findFirst({
      where: eq(dbSchema.lessons.id, where.id),
    });

    if (!lesson) {
      return null;
    }

    return lesson;
  }

  async findOneOrThrow(where: Pick<ILesson, 'id'>): Promise<ILesson> {
    const lesson = await this.findOne(where);

    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    return lesson;
  }

  async findManyByChapterId(where: Pick<ILesson, 'chapterId'>) {
    return await this.drizzle.db.query.lessons.findMany({
      where: eq(dbSchema.lessons.chapterId, where.chapterId),
    });
  }
}
