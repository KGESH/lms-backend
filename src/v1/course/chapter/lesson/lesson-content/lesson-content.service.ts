import { Injectable } from '@nestjs/common';
import { LessonContentRepository } from './lesson-content.repository';
import {
  ILessonContent,
  ILessonContentCreate,
} from './lesson-content.interface';
import { TransactionClient } from '../../../../../infra/db/drizzle.types';

@Injectable()
export class LessonContentService {
  constructor(private readonly lessonRepository: LessonContentRepository) {}

  async createLessonContent(
    params: ILessonContentCreate,
    tx?: TransactionClient,
  ): Promise<ILessonContent> {
    return await this.lessonRepository.create(params, tx);
  }

  async updateLessonContent(
    where: Pick<ILessonContent, 'id'>,
    params: Partial<ILessonContent>,
    tx?: TransactionClient,
  ): Promise<ILessonContent> {
    await this.lessonRepository.findOneOrThrow({ id: where.id });
    return await this.lessonRepository.update(where, params, tx);
  }

  async deleteLessonContent(
    where: Pick<ILessonContent, 'id'>,
    tx?: TransactionClient,
  ): Promise<ILessonContent> {
    await this.lessonRepository.findOneOrThrow({ id: where.id });
    return await this.lessonRepository.delete(where, tx);
  }
}
