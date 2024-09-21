import { Uuid } from '@src/shared/types/primitive';
import { ILessonContent } from '@src/v1/course/chapter/lesson/lesson-content/lesson-content.interface';
import { IUserWithoutPassword } from "@src/v1/user/user.interface";
import { IOrder } from "@src/v1/order/order.interface";

export type IUserCourseResourceHistory = {
  courseId: Uuid;
  history: {
    id: Uuid;
    lessonContentId: Uuid;
    createdAt: Date;
    lessonContent: ILessonContent;
  };
};

export type IPurchasedUser = {
  user: IUserWithoutPassword;
  order: IOrder
}
