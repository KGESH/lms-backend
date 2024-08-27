import { TransactionClient } from '../../../../../src/infra/db/drizzle.types';
import { seedUsers } from './user.helper';
import { createRandomCourseProduct } from './course-product.helper';
import { dbSchema } from '../../../../../src/infra/db/schema';
import { IOrderCreate } from '../../../../../src/v1/order/order.interface';
import * as typia from 'typia';
import { createRandomEbookProduct } from './ebook-product.helper';

export const createRandomCourseOrder = async (db: TransactionClient) => {
  const { user, userSession } = (await seedUsers({ count: 1 }, db))[0];

  const product = await createRandomCourseProduct(db);
  const orderCreateParams: IOrderCreate = {
    ...typia.random<IOrderCreate>(),
    userId: user.id,
    productType: 'course',
  };

  const [order] = await db
    .insert(dbSchema.orders)
    .values(orderCreateParams)
    .returning();
  const [courseOrder] = await db
    .insert(dbSchema.courseOrders)
    .values({
      orderId: order.id,
      productSnapshotId: product.lastSnapshot!.id,
    })
    .returning();

  return {
    user,
    userSession,
    order,
    courseOrder,
    product,
  };
};

export const createRandomEbookOrder = async (db: TransactionClient) => {
  const { user, userSession } = (await seedUsers({ count: 1 }, db))[0];

  const product = await createRandomEbookProduct(db);
  const orderCreateParams: IOrderCreate = {
    ...typia.random<IOrderCreate>(),
    userId: user.id,
    productType: 'ebook',
  };

  const [order] = await db
    .insert(dbSchema.orders)
    .values(orderCreateParams)
    .returning();
  const [ebookOrder] = await db
    .insert(dbSchema.ebookOrders)
    .values({
      orderId: order.id,
      productSnapshotId: product.lastSnapshot!.id,
    })
    .returning();

  return {
    user,
    userSession,
    order,
    ebookOrder,
    product,
  };
};

export const seedCourseOrders = async (
  { count }: { count: number },
  db: TransactionClient,
) => {
  return await Promise.all(
    Array.from({ length: count }).map(() => createRandomCourseOrder(db)),
  );
};

export const seedEbookOrders = async (
  { count }: { count: number },
  db: TransactionClient,
) => {
  return await Promise.all(
    Array.from({ length: count }).map(() => createRandomEbookOrder(db)),
  );
};
