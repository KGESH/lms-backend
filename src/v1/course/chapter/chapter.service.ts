import { Injectable, NotFoundException } from '@nestjs/common';
import { TransactionClient } from '@src/infra/db/drizzle.types';
import { CourseQueryService } from '@src/v1/course/course-query.service';
import { ChapterRepository } from '@src/v1/course/chapter/chapter.repository';
import {
  IChapter,
  IChapterCreate,
  IChapterUpdate,
} from '@src/v1/course/chapter/chapter.interface';
import { ChapterQueryRepository } from '@src/v1/course/chapter/chapter-query.repository';

@Injectable()
export class ChapterService {
  constructor(
    private readonly courseQueryService: CourseQueryService,
    private readonly chapterRepository: ChapterRepository,
    private readonly chapterQueryRepository: ChapterQueryRepository,
  ) {}

  async createChapter(
    params: Omit<IChapterCreate, 'sequence'>,
    tx?: TransactionClient,
  ): Promise<IChapter> {
    const course = await this.courseQueryService.findCourseById({
      id: params.courseId,
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    const existChapters =
      await this.chapterQueryRepository.findChaptersByCourseId({
        courseId: params.courseId,
      });

    const maxSequence = Math.max(
      ...existChapters.map((chapter) => chapter.sequence),
      0,
    );

    return await this.chapterRepository.createChapter(
      {
        ...params,
        sequence: maxSequence + 1,
      },
      tx,
    );
  }

  async updateChapter(
    where: Pick<IChapter, 'id'>,
    params: IChapterUpdate,
    tx?: TransactionClient,
  ): Promise<IChapter> {
    await this.chapterQueryRepository.findChapterOrThrow({ id: where.id });
    return await this.chapterRepository.updateChapter(where, params, tx);
  }

  async deleteChapter(
    where: Pick<IChapter, 'id'>,
    tx?: TransactionClient,
  ): Promise<IChapter> {
    await this.chapterQueryRepository.findChapterOrThrow({ id: where.id });
    return await this.chapterRepository.deleteChapter(where, tx);
  }
}
