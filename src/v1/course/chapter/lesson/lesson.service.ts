import { Injectable, NotFoundException } from '@nestjs/common';
import { TransactionClient } from '@src/infra/db/drizzle.types';
import { ChapterQueryService } from '@src/v1/course/chapter/chapter-query.service';
import { LessonRepository } from '@src/v1/course/chapter/lesson/lesson.repository';
import {
  ILesson,
  ILessonCreate,
  ILessonUpdate,
} from '@src/v1/course/chapter/lesson/lesson.interface';
import { LessonQueryRepository } from '@src/v1/course/chapter/lesson/lesson-query.repository';

@Injectable()
export class LessonService {
  constructor(
    private readonly chapterQueryService: ChapterQueryService,
    private readonly lessonRepository: LessonRepository,
    private readonly lessonQueryRepository: LessonQueryRepository,
  ) {}

  async createLesson(
    params: ILessonCreate,
    tx?: TransactionClient,
  ): Promise<ILesson> {
    const chapter = await this.chapterQueryService.findChapterById({
      id: params.chapterId,
    });

    if (!chapter) {
      throw new NotFoundException('Chapter not found');
    }

    return await this.lessonRepository.createLesson(params, tx);
  }

  async updateLesson(
    where: Pick<ILesson, 'id'>,
    params: ILessonUpdate,
    tx?: TransactionClient,
  ): Promise<ILesson> {
    await this.lessonQueryRepository.findOneOrThrow({ id: where.id });
    return await this.lessonRepository.updateLesson(where, params, tx);
  }

  async deleteLesson(
    where: Pick<ILesson, 'id'>,
    tx?: TransactionClient,
  ): Promise<ILesson> {
    await this.lessonQueryRepository.findOneOrThrow({ id: where.id });
    return await this.lessonRepository.deleteLesson(where, tx);
  }
}
