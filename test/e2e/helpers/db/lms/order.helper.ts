import { TransactionClient } from '../../../../../src/infra/db/drizzle.types';
import { seedUsers } from './user.helper';
import { createRandomCourseProduct } from './course-product.helper';
import { dbSchema } from '../../../../../src/infra/db/schema';
import { IOrderCreate } from '../../../../../src/v1/order/order.interface';
import * as typia from 'typia';
import { createRandomEbookProduct } from './ebook-product.helper';
import { IUser } from '@src/v1/user/user.interface';
import { ISession } from '@src/v1/auth/session.interface';

export const createRandomCourseOrder = async (
  db: TransactionClient,
  seedUser?: { user: IUser; userSession: ISession },
) => {
  seedUser ??= (await seedUsers({ count: 1 }, db))[0];

  const product = await createRandomCourseProduct(db);
  const orderCreateParams: IOrderCreate = {
    ...typia.random<IOrderCreate>(),
    paymentId: null,
    txId: null,
    userId: seedUser.user.id,
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
  const [enrollment] = await db
    .insert(dbSchema.courseEnrollments)
    .values({
      courseId: product.course.id,
      userId: seedUser.user.id,
    })
    .returning();

  return {
    user: seedUser.user,
    userSession: seedUser.userSession,
    order,
    courseOrder,
    product,
    enrollment,
  };
};

export const createRandomEbookOrder = async (
  db: TransactionClient,
  seedUser?: { user: IUser; userSession: ISession },
) => {
  seedUser ??= (await seedUsers({ count: 1 }, db))[0];

  const product = await createRandomEbookProduct(db);
  const orderCreateParams: IOrderCreate = {
    ...typia.random<IOrderCreate>(),
    paymentId: null,
    txId: null,
    userId: seedUser.user.id,
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
  const [enrollment] = await db
    .insert(dbSchema.ebookEnrollments)
    .values({
      ebookId: product.ebook.id,
      userId: seedUser.user.id,
    })
    .returning();

  return {
    user: seedUser.user,
    userSession: seedUser.userSession,
    order,
    ebookOrder,
    product,
    enrollment,
  };
};

export const seedCourseOrders = async (
  { count }: { count: number },
  db: TransactionClient,
  seedUser?: { user: IUser; userSession: ISession },
) => {
  return await Promise.all(
    Array.from({ length: count }).map(() =>
      createRandomCourseOrder(db, seedUser),
    ),
  );
};

export const seedEbookOrders = async (
  { count }: { count: number },
  db: TransactionClient,
  seedUser?: { user: IUser; userSession: ISession },
) => {
  return await Promise.all(
    Array.from({ length: count }).map(() =>
      createRandomEbookOrder(db, seedUser),
    ),
  );
};
