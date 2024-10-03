import { ICourseOrderWithRelations } from '@src/v1/order/course/course-order.interface';
import { OrderBaseDto } from '@src/v1/order/order.dto';
import * as date from '@src/shared/utils/date';
import { CourseOrderDto } from '@src/v1/order/course/course-order.dto';
import { IOrder } from '@src/v1/order/order.interface';

export const orderToDto = (order: IOrder): OrderBaseDto => ({
  id: order.id,
  userId: order.userId,
  paymentMethod: order.paymentMethod,
  title: order.title,
  description: order.description,
  amount: order.amount,
  paidAt: date.toIsoStringOrNull(order.paidAt),
});

export const courseOrderRelationsToDto = (
  courseOrderRelations: ICourseOrderWithRelations,
): CourseOrderDto => {
  return {
    id: courseOrderRelations.id,
    userId: courseOrderRelations.userId,
    amount: courseOrderRelations.amount,
    title: courseOrderRelations.title,
    description: courseOrderRelations.description,
    paymentMethod: courseOrderRelations.paymentMethod,
    paidAt: date.toIsoStringOrNull(courseOrderRelations.paidAt),

    course: {
      id: courseOrderRelations.course.id,
      title: courseOrderRelations.course.title,
      teacherId: courseOrderRelations.course.teacherId,
      categoryId: courseOrderRelations.course.categoryId,
      description: courseOrderRelations.course.description,
      createdAt: date.toISOString(courseOrderRelations.course.createdAt),
      updatedAt: date.toISOString(courseOrderRelations.course.updatedAt),
      category: courseOrderRelations.course.category,
      thumbnail: {
        ...courseOrderRelations.course.thumbnail,
        createdAt: date.toISOString(
          courseOrderRelations.course.thumbnail.createdAt,
        ),
      },
      teacher: {
        id: courseOrderRelations.course.teacher.id,
        userId: courseOrderRelations.course.teacher.userId,
        account: {
          ...courseOrderRelations.course.teacher.account,
          emailVerified: date.toIsoStringOrNull(
            courseOrderRelations.course.teacher.account.emailVerified,
          ),
          createdAt: date.toISOString(
            courseOrderRelations.course.teacher.account.createdAt,
          ),
          updatedAt: date.toISOString(
            courseOrderRelations.course.teacher.account.updatedAt,
          ),
          deletedAt: date.toIsoStringOrNull(
            courseOrderRelations.course.teacher.account.deletedAt,
          ),
        },
      },
    },
  };
};
