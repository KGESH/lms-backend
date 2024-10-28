import { Uuid } from '@src/shared/types/primitive';
import { ILessonContentWithFile } from '@src/v1/course/chapter/lesson/lesson-content/lesson-content.interface';

export type ILessonContentHistory = {
  id: Uuid;
  userId: Uuid;
  lessonContentId: Uuid;
  createdAt: Date;
};

export type ILessonContentHistoryCreate = Pick<
  ILessonContentHistory,
  'userId' | 'lessonContentId'
>;

export type ILessonContentWithHistory = ILessonContentWithFile & {
  history: ILessonContentHistory | null;
};
