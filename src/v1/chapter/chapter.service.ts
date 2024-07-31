import { Injectable } from '@nestjs/common';
import { ChapterRepository } from './chapter.repository';
import { IChapter, IChapterCreate } from './chapter.interface';
import { TransactionClient } from '../../infra/db/drizzle.types';

@Injectable()
export class ChapterService {
  constructor(private readonly chapterRepository: ChapterRepository) {}

  async createChapter(
    params: IChapterCreate,
    tx?: TransactionClient,
  ): Promise<IChapter> {
    return await this.chapterRepository.create(params, tx);
  }

  async updateChapter(
    where: Pick<IChapter, 'id'>,
    params: Partial<IChapter>,
    tx?: TransactionClient,
  ): Promise<IChapter> {
    await this.chapterRepository.findOneOrThrow({ id: where.id });
    return await this.chapterRepository.update(where, params, tx);
  }

  async deleteChapter(
    where: Pick<IChapter, 'id'>,
    tx?: TransactionClient,
  ): Promise<IChapter> {
    await this.chapterRepository.findOneOrThrow({ id: where.id });
    return await this.chapterRepository.delete(where, tx);
  }
}
