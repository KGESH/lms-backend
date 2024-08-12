import { Injectable, NotFoundException } from '@nestjs/common';
import { ChapterRepository } from './chapter.repository';
import { IChapter, IChapterCreate, IChapterUpdate } from './chapter.interface';
import { TransactionClient } from '../../../infra/db/drizzle.types';
import { CourseQueryService } from '../course-query.service';

@Injectable()
export class ChapterService {
  constructor(
    private readonly courseQueryService: CourseQueryService,
    private readonly chapterRepository: ChapterRepository,
  ) {}

  async createChapter(
    params: IChapterCreate,
    tx?: TransactionClient,
  ): Promise<IChapter> {
    const course = await this.courseQueryService.findCourseById({
      id: params.courseId,
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    return await this.chapterRepository.create(params, tx);
  }

  async updateChapter(
    where: Pick<IChapter, 'id'>,
    params: IChapterUpdate,
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
