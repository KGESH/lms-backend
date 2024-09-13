import { Injectable, NotFoundException } from '@nestjs/common';
import { ILessonContent } from '@src/v1/course/chapter/lesson/lesson-content/lesson-content.interface';
import { LessonContentQueryRepository } from '@src/v1/course/chapter/lesson/lesson-content/lesson-content-query.repository';
import { LessonContentHistoryRepository } from '@src/v1/course/chapter/lesson/lesson-content/history/lesson-content-history.repository';
import { LessonContentHistoryQueryRepository } from '@src/v1/course/chapter/lesson/lesson-content/history/lesson-content-history-query.repository';
import {
  ILessonContentHistory,
  ILessonContentWithHistory,
} from '@src/v1/course/chapter/lesson/lesson-content/history/lesson-content-history.interface';

@Injectable()
export class LessonContentQueryService {
  constructor(
    private readonly lessonContentHistoryRepository: LessonContentHistoryRepository,
    private readonly lessonContentHistoryQueryRepository: LessonContentHistoryQueryRepository,
    private readonly lessonContentQueryRepository: LessonContentQueryRepository,
  ) {}

  async findLessonContents(
    where: Pick<ILessonContent, 'lessonId'>,
  ): Promise<ILessonContent[]> {
    return await this.lessonContentQueryRepository.findManyByLessonId(where);
  }

  async findLessonContentById(
    where: Pick<ILessonContent, 'id'>,
  ): Promise<ILessonContent | null> {
    return await this.lessonContentQueryRepository.findLessonContent(where);
  }

  async getLessonContentWithHistory(
    where: Pick<ILessonContentHistory, 'userId' | 'lessonContentId'>,
  ): Promise<ILessonContentWithHistory> {
    const lessonContent =
      await this.lessonContentQueryRepository.findLessonContentOrThrow({
        id: where.lessonContentId,
      });

    const existHistory =
      await this.lessonContentHistoryQueryRepository.findLessonContentWithHistory(
        where,
      );

    const history =
      existHistory ??
      (await this.lessonContentHistoryRepository.createLessonContentHistory({
        userId: where.userId,
        lessonContentId: where.lessonContentId,
      }));

    return {
      ...lessonContent,
      history,
    };
  }
}
