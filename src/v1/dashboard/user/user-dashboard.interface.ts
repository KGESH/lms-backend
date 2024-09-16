import { Uuid } from '@src/shared/types/primitive';

export type IUserCourseResourceHistory = {
  courseId: Uuid;
  history: {
    id: Uuid;
    lessonContentId: Uuid;
    createdAt: Date;
  };
};
