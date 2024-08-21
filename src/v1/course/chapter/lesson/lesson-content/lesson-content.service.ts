import { Injectable } from '@nestjs/common';
import { LessonContentRepository } from './lesson-content.repository';
import {
  ILessonContent,
  ILessonContentCreate,
  ILessonContentUpdate,
} from './lesson-content.interface';
import { TransactionClient } from '../../../../../infra/db/drizzle.types';
import { LessonContentQueryRepository } from './lesson-content-query.repository';

@Injectable()
export class LessonContentService {
  constructor(
    private readonly lessonContentRepository: LessonContentRepository,
    private readonly lessonContentQueryRepository: LessonContentQueryRepository,
  ) {}

  async createLessonContent(
    params: ILessonContentCreate,
    tx?: TransactionClient,
  ): Promise<ILessonContent> {
    return await this.lessonContentRepository.createLessonContent(params, tx);
  }

  async updateLessonContent(
    where: Pick<ILessonContent, 'id'>,
    params: ILessonContentUpdate,
    tx?: TransactionClient,
  ): Promise<ILessonContent> {
    await this.lessonContentQueryRepository.findOneOrThrow({ id: where.id });
    return await this.lessonContentRepository.updateLessonContent(
      where,
      params,
      tx,
    );
  }

  async deleteLessonContent(
    where: Pick<ILessonContent, 'id'>,
    tx?: TransactionClient,
  ): Promise<ILessonContent> {
    await this.lessonContentQueryRepository.findOneOrThrow({ id: where.id });
    return await this.lessonContentRepository.deleteLessonContent(where, tx);
  }
}
