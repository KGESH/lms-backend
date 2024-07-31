import { Injectable } from '@nestjs/common';
import { LessonRepository } from './lesson.repository';
import { ILesson, ILessonCreate } from './lesson.interface';
import { TransactionClient } from '../../../infra/db/drizzle.types';

@Injectable()
export class LessonService {
  constructor(private readonly lessonRepository: LessonRepository) {}

  async createLesson(
    params: ILessonCreate,
    tx?: TransactionClient,
  ): Promise<ILesson> {
    return await this.lessonRepository.create(params, tx);
  }

  async updateLesson(
    where: Pick<ILesson, 'id'>,
    params: Partial<ILesson>,
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
