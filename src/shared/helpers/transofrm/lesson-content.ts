import * as date from '@src/shared/utils/date';
import { ILessonContentWithHistory } from '@src/v1/course/chapter/lesson/lesson-content/history/lesson-content-history.interface';
import { LessonContentWithHistoryDto } from '@src/v1/course/chapter/lesson/lesson-content/history/lesson-content-history.dto';
import { ILessonContent } from '@src/v1/course/chapter/lesson/lesson-content/lesson-content.interface';
import { LessonContentDto } from '@src/v1/course/chapter/lesson/lesson-content/lesson-content.dto';

export const lessonContentToDto = (
  lessonContent: ILessonContent,
): LessonContentDto => lessonContent;

export const lessonContentWithHistoryToDto = (
  lessonContentWithHistory: ILessonContentWithHistory,
): LessonContentWithHistoryDto => ({
  ...lessonContentWithHistory,
  history: lessonContentWithHistory.history
    ? {
        ...lessonContentWithHistory.history,
        createdAt: date.toISOString(lessonContentWithHistory.history.createdAt),
      }
    : null,
});
