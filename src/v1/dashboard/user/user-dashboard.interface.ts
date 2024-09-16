import { Uuid } from '@src/shared/types/primitive';
import { ILessonContent } from '@src/v1/course/chapter/lesson/lesson-content/lesson-content.interface';

export type IUserCourseResourceHistory = {
  courseId: Uuid;
  history: {
    id: Uuid;
    lessonContentId: Uuid;
    createdAt: Date;
    lessonContent: ILessonContent;
  };
};
