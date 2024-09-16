import { ISO8601, Uuid } from '@src/shared/types/primitive';

export type UserCourseResourceHistoryDto = {
  courseId: Uuid;
  history: {
    id: Uuid;
    lessonContentId: Uuid;
    createdAt: ISO8601;
  };
};
