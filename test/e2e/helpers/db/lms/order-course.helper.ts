import { dbSchema } from '../../../../../src/infra/db/schema';
import { TransactionClient } from '../../../../../src/infra/db/drizzle.types';
import {
  ICourseOrder,
  ICourseOrderCreate,
} from '../../../../../src/v1/order/course/course-order.interface';
import * as typia from 'typia';
import { Price } from '../../../../../src/shared/types/primitive';

export const createCourseOrder = async (
  params: ICourseOrderCreate,
  db: TransactionClient,
): Promise<ICourseOrder> => {
  const [courseOrder] = await db
    .insert(dbSchema.courseOrders)
    .values(params)
    .returning();

  return {
    ...courseOrder,
    amount: typia.assert<Price>(courseOrder.amount),
  };
};

export const createManyCourseOrders = async (
  params: ICourseOrderCreate[],
  db: TransactionClient,
): Promise<ICourseOrder[]> => {
  const courseOrders = await db
    .insert(dbSchema.courseOrders)
    .values(params)
    .returning();

  return courseOrders.map((courseOrder) => ({
    ...courseOrder,
    amount: typia.assert<Price>(courseOrder.amount),
  }));
};
