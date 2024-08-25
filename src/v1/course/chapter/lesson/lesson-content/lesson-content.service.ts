import { Injectable, NotFoundException } from '@nestjs/common';
import { TransactionClient } from '@src/infra/db/drizzle.types';
import {
  ILessonContent,
  ILessonContentCreate,
  ILessonContentUpdate,
} from '@src/v1/course/chapter/lesson/lesson-content/lesson-content.interface';
import { LessonContentQueryRepository } from '@src/v1/course/chapter/lesson/lesson-content/lesson-content-query.repository';
import { LessonContentRepository } from '@src/v1/course/chapter/lesson/lesson-content/lesson-content.repository';
import { LessonQueryService } from '@src/v1/course/chapter/lesson/lesson-query.service';

@Injectable()
export class LessonContentService {
  constructor(
    private readonly lessonQueryService: LessonQueryService,
    private readonly lessonContentRepository: LessonContentRepository,
    private readonly lessonContentQueryRepository: LessonContentQueryRepository,
  ) {}

  async createLessonContent(
    params: Omit<ILessonContentCreate, 'sequence'>,
    tx?: TransactionClient,
  ): Promise<ILessonContent> {
    const lesson = await this.lessonQueryService.findLessonById({
      id: params.lessonId,
    });

    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    const existContents =
      await this.lessonContentQueryRepository.findManyByLessonId({
        lessonId: params.lessonId,
      });

    const maxSequence = Math.max(
      ...existContents.map((content) => content.sequence ?? 0),
      0,
    );

    return await this.lessonContentRepository.createLessonContent(
      {
        ...params,
        sequence: maxSequence + 1,
      },
      tx,
    );
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
