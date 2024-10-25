import * as date from '@src/shared/utils/date';
import { ILessonContentWithHistory } from '@src/v1/course/chapter/lesson/lesson-content/history/lesson-content-history.interface';
import { LessonContentWithHistoryDto } from '@src/v1/course/chapter/lesson/lesson-content/history/lesson-content-history.dto';

export const lessonContentWithHistoryToDto = (
  lessonContentWithHistory: ILessonContentWithHistory,
): LessonContentWithHistoryDto | null => ({
  ...lessonContentWithHistory,
  history: lessonContentWithHistory.history
    ? {
        ...lessonContentWithHistory.history,
        createdAt: date.toISOString(lessonContentWithHistory.history.createdAt),
      }
    : null,
});
