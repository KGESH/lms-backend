import { Injectable } from '@nestjs/common';
import { ChapterRepository } from './chapter.repository';
import { IChapter } from './chapter.interface';

@Injectable()
export class ChapterQueryService {
  constructor(private readonly chapterRepository: ChapterRepository) {}

  async findChapters(): Promise<IChapter[]> {
    return await this.chapterRepository.findMany();
  }

  async findChapterById(where: Pick<IChapter, 'id'>): Promise<IChapter | null> {
    return await this.chapterRepository.findOne(where);
  }
}
