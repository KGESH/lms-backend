import { Injectable } from '@nestjs/common';
import { IChapter } from '@src/v1/course/chapter/chapter.interface';
import { ChapterQueryRepository } from '@src/v1/course/chapter/chapter-query.repository';

@Injectable()
export class ChapterQueryService {
  constructor(
    private readonly chapterQueryRepository: ChapterQueryRepository,
  ) {}

  async findChapters(where: Pick<IChapter, 'courseId'>): Promise<IChapter[]> {
    return await this.chapterQueryRepository.findChaptersByCourseId(where);
  }

  async findChapterById(where: Pick<IChapter, 'id'>): Promise<IChapter | null> {
    return await this.chapterQueryRepository.findChapter(where);
  }
}
