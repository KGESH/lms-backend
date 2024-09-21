import { ISO8601, Uuid } from '@src/shared/types/primitive';
import { LessonContentDto } from '@src/v1/course/chapter/lesson/lesson-content/lesson-content.dto';
import { Pagination } from '@src/shared/types/pagination';
import { UserWithoutPasswordDto } from '@src/v1/user/user.dto';
import { OrderBaseDto } from '@src/v1/order/order.dto';

export type UserCourseResourceHistoryDto = {
  courseId: Uuid;
  history: {
    id: Uuid;
    lessonContentId: Uuid;
    createdAt: ISO8601;
    lessonContent: LessonContentDto;
  };
};

export type CourseResourceHistoryQuery = {
  userId: Uuid;
  courseId: Uuid;
};

export type PurchasedCourseUsersQuery = Partial<Pagination> & {
  courseId: Uuid;
};

export type PurchasedUserDto = {
  user: UserWithoutPasswordDto;
  order: OrderBaseDto;
};

export type UserCourseEnrollmentHistoriesQuery = {
  userId: Uuid;
};
