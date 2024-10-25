import { Injectable } from '@nestjs/common';
import { ILessonContent } from '@src/v1/course/chapter/lesson/lesson-content/lesson-content.interface';
import { LessonContentQueryRepository } from '@src/v1/course/chapter/lesson/lesson-content/lesson-content-query.repository';
import { LessonContentHistoryRepository } from '@src/v1/course/chapter/lesson/lesson-content/history/lesson-content-history.repository';
import { LessonContentHistoryQueryRepository } from '@src/v1/course/chapter/lesson/lesson-content/history/lesson-content-history-query.repository';
import {
  ILessonContentHistory,
  ILessonContentWithHistory,
} from '@src/v1/course/chapter/lesson/lesson-content/history/lesson-content-history.interface';
import { IUserWithoutPassword } from '@src/v1/user/user.interface';

@Injectable()
export class LessonContentQueryService {
  constructor(
    private readonly lessonContentQueryRepository: LessonContentQueryRepository,
    private readonly lessonContentHistoryRepository: LessonContentHistoryRepository,
    private readonly lessonContentHistoryQueryRepository: LessonContentHistoryQueryRepository,
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
    user: IUserWithoutPassword,
    where: Pick<ILessonContentHistory, 'lessonContentId'>,
  ): Promise<ILessonContentWithHistory> {
    const lessonContent =
      await this.lessonContentQueryRepository.findLessonContentOrThrow({
        id: where.lessonContentId,
      });

    if (user.role !== 'user') {
      return {
        ...lessonContent,
        history: null,
      };
    }

    const existHistory =
      await this.lessonContentHistoryQueryRepository.findLessonContentAccessHistory(
        {
          userId: user.id,
          lessonContentId: where.lessonContentId,
        },
      );

    const history =
      existHistory ??
      (await this.lessonContentHistoryRepository.createLessonContentHistory({
        userId: user.id,
        lessonContentId: where.lessonContentId,
      }));

    return {
      ...lessonContent,
      history,
    };
  }
}
