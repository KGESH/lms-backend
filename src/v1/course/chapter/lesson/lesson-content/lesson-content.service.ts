import { Injectable } from '@nestjs/common';
import { LessonContentRepository } from './lesson-content.repository';
import {
  ILessonContent,
  ILessonContentCreate,
} from './lesson-content.interface';
import { TransactionClient } from '../../../../../infra/db/drizzle.types';

@Injectable()
export class LessonContentService {
  constructor(
    private readonly lessonContentRepository: LessonContentRepository,
  ) {}

  async createLessonContent(
    params: ILessonContentCreate,
    tx?: TransactionClient,
  ): Promise<ILessonContent> {
    return await this.lessonContentRepository.create(params, tx);
  }

  async updateLessonContent(
    where: Pick<ILessonContent, 'id'>,
    params: Partial<ILessonContent>,
    tx?: TransactionClient,
  ): Promise<ILessonContent> {
    await this.lessonContentRepository.findOneOrThrow({ id: where.id });
    return await this.lessonContentRepository.update(where, params, tx);
  }

  async deleteLessonContent(
    where: Pick<ILessonContent, 'id'>,
    tx?: TransactionClient,
  ): Promise<ILessonContent> {
    await this.lessonContentRepository.findOneOrThrow({ id: where.id });
    return await this.lessonContentRepository.delete(where, tx);
  }
}
