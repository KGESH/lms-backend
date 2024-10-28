import { ISO8601, Uuid } from '@src/shared/types/primitive';
import { LessonContentWithFileDto } from '@src/v1/course/chapter/lesson/lesson-content/lesson-content.dto';

export type LessonContentHistoryDto = {
  id: Uuid;
  userId: Uuid;
  lessonContentId: Uuid;
  createdAt: ISO8601;
};

export type LessonContentWithHistoryDto = LessonContentWithFileDto & {
  history: LessonContentHistoryDto | null;
};
