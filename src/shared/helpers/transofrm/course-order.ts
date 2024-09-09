import {
  ICourseOrderRelations,
  ICourseOrderWithRelations,
} from '@src/v1/order/course/course-order.interface';
import { OrderCourseDto } from '@src/v1/order/order.dto';
import * as typia from 'typia';
import * as date from '@src/shared/utils/date';
import { CourseOrderDto } from '@src/v1/order/course/course-order.dto';

export const courseOrderToDto = (courseOrder: unknown): OrderCourseDto => {
  const order = courseOrder as ICourseOrderRelations;
  return typia.assert<OrderCourseDto>({
    id: order.id,
    userId: order.userId,
    productType: 'course',
    title: order.title,
    description: order.description,
    product: {
      courseId: order.productOrder.productSnapshot.courseId,
      snapshotId: order.productOrder.productSnapshot.id,
      title: order.productOrder.productSnapshot.title,
      description: order.productOrder.productSnapshot.description,
      announcement: {
        ...order.productOrder.productSnapshot.announcement,
      },
      refundPolicy: {
        ...order.productOrder.productSnapshot.refundPolicy,
      },
      content: {
        ...order.productOrder.productSnapshot.content,
      },
      pricing: {
        ...order.productOrder.productSnapshot.pricing,
      },
      discounts: order.productOrder.productSnapshot.discounts
        ? {
            ...order.productOrder.productSnapshot.discounts,
            validTo: order.productOrder.productSnapshot.discounts.validTo
              ? date.toISOString(
                  order.productOrder.productSnapshot.discounts.validTo,
                )
              : null,
            validFrom: order.productOrder.productSnapshot.discounts.validFrom
              ? date.toISOString(
                  order.productOrder.productSnapshot.discounts.validFrom,
                )
              : null,
          }
        : null,
      createdAt: date.toISOString(order.productOrder.productSnapshot.createdAt),
      updatedAt: date.toISOString(order.productOrder.productSnapshot.updatedAt),
      deletedAt: order.productOrder.productSnapshot.deletedAt
        ? date.toISOString(order.productOrder.productSnapshot.deletedAt)
        : null,
    },
    paymentMethod: order.paymentMethod,
    amount: order.amount,
    paidAt: order.paidAt ? date.toISOString(order.paidAt) : null,
  });
};

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
    paidAt: courseOrderRelations.paidAt
      ? date.toISOString(courseOrderRelations.paidAt)
      : null,
    course: {
      id: courseOrderRelations.course.id,
      title: courseOrderRelations.course.title,
      teacherId: courseOrderRelations.course.teacherId,
      categoryId: courseOrderRelations.course.categoryId,
      description: courseOrderRelations.course.description,
      createdAt: date.toISOString(courseOrderRelations.course.createdAt),
      updatedAt: date.toISOString(courseOrderRelations.course.updatedAt),
      category: courseOrderRelations.course.category,
      teacher: {
        id: courseOrderRelations.course.teacher.id,
        userId: courseOrderRelations.course.teacher.userId,
        account: {
          ...courseOrderRelations.course.teacher.account,
          emailVerified: courseOrderRelations.course.teacher.account
            .emailVerified
            ? date.toISOString(
                courseOrderRelations.course.teacher.account.emailVerified,
              )
            : null,
          createdAt: date.toISOString(
            courseOrderRelations.course.teacher.account.createdAt,
          ),
          updatedAt: date.toISOString(
            courseOrderRelations.course.teacher.account.updatedAt,
          ),
          deletedAt: courseOrderRelations.course.teacher.account.deletedAt
            ? date.toISOString(
                courseOrderRelations.course.teacher.account.deletedAt,
              )
            : null,
        },
      },
    },
  };
};
