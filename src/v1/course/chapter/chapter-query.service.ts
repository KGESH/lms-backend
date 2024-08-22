import { Injectable } from '@nestjs/common';
import { ChapterRepository } from '@src/v1/course/chapter/chapter.repository';
import { IChapter } from '@src/v1/course/chapter/chapter.interface';

@Injectable()
export class ChapterQueryService {
  constructor(private readonly chapterRepository: ChapterRepository) {}

  async findChapters(where: Pick<IChapter, 'courseId'>): Promise<IChapter[]> {
    return await this.chapterRepository.findManyByCourseId(where);
  }

  async findChapterById(where: Pick<IChapter, 'id'>): Promise<IChapter | null> {
    return await this.chapterRepository.findOne(where);
  }
}
