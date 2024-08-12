import { Injectable, NotFoundException } from '@nestjs/common';
import { LessonRepository } from './lesson.repository';
import { ILesson, ILessonCreate, ILessonUpdate } from './lesson.interface';
import { TransactionClient } from '../../../../infra/db/drizzle.types';
import { ChapterQueryService } from '../chapter-query.service';

@Injectable()
export class LessonService {
  constructor(
    private readonly chapterQueryService: ChapterQueryService,
    private readonly lessonRepository: LessonRepository,
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

    return await this.lessonRepository.create(params, tx);
  }

  async updateLesson(
    where: Pick<ILesson, 'id'>,
    params: ILessonUpdate,
    tx?: TransactionClient,
  ): Promise<ILesson> {
    await this.lessonRepository.findOneOrThrow({ id: where.id });
    return await this.lessonRepository.update(where, params, tx);
  }

  async deleteLesson(
    where: Pick<ILesson, 'id'>,
    tx?: TransactionClient,
  ): Promise<ILesson> {
    await this.lessonRepository.findOneOrThrow({ id: where.id });
    return await this.lessonRepository.delete(where, tx);
  }
}
