import * as typia from 'typia';
import { dbSchema } from '../../../../../src/infra/db/schema';
import {
  ICoupon,
  ICouponCreate,
} from '../../../../../src/v1/coupon/coupon.interface';
import { TransactionClient } from '../../../../../src/infra/db/drizzle.types';
import {
  ICouponTicket,
  ICouponTicketCreate,
  ICouponTicketRelations,
} from '../../../../../src/v1/coupon/ticket/coupon-ticket.interface';
import {
  ICouponDisposable,
  ICouponDisposableCreate,
} from '../../../../../src/v1/coupon/disposable/coupon-disposable.interface';
import {
  ICouponTicketPayment,
  ICouponTicketPaymentCreate,
} from '../../../../../src/v1/coupon/ticket/payment/coupon-ticket-payment.interface';
import { IUserWithoutPassword } from '../../../../../src/v1/user/user.interface';
import { seedUsers } from './user.helper';
import {
  ICouponAllCriteria,
  ICouponCategoryCriteria,
  ICouponCourseCriteria,
  ICouponCriteria,
  ICouponCriteriaCreate,
  ICouponEbookCriteria,
  ICouponTeacherCriteria,
} from '../../../../../src/v1/coupon/criteria/coupon-criteria.interface';

export const createCoupon = async (
  params: ICouponCreate,
  db: TransactionClient,
): Promise<ICoupon> => {
  const [coupon] = await db.insert(dbSchema.coupons).values(params).returning();

  return typia.assert<ICoupon>({
    id: coupon.id,
    name: coupon.name,
    description: coupon.description,
    closedAt: coupon.closedAt,
    discountType: coupon.discountType,
    expiredAt: coupon.expiredAt,
    expiredIn: coupon.expiredIn,
    limit: coupon.limit,
    openedAt: coupon.openedAt,
    threshold: coupon.threshold,
    value: coupon.value,
    volume: coupon.volume,
    volumePerCitizen: coupon.volumePerCitizen,
  });
};

export const createManyCoupons = async (
  params: ICouponCreate[],
  db: TransactionClient,
): Promise<ICoupon[]> => {
  const coupons = await db.insert(dbSchema.coupons).values(params).returning();
  return coupons.map((coupon) =>
    typia.assert<ICoupon>({
      id: coupon.id,
      name: coupon.name,
      description: coupon.description,
      closedAt: coupon.closedAt,
      discountType: coupon.discountType,
      expiredAt: coupon.expiredAt,
      expiredIn: coupon.expiredIn,
      limit: coupon.limit,
      openedAt: coupon.openedAt,
      threshold: coupon.threshold,
      value: coupon.value,
      volume: coupon.volume,
      volumePerCitizen: coupon.volumePerCitizen,
    }),
  );
};

export const createCouponTicket = async (
  params: ICouponTicketCreate,
  db: TransactionClient,
): Promise<ICouponTicket> => {
  const [couponTicket] = await db
    .insert(dbSchema.couponTickets)
    .values(params)
    .returning();

  return couponTicket;
};

export const createCouponDisposable = async (
  params: ICouponDisposableCreate,
  db: TransactionClient,
): Promise<ICouponDisposable> => {
  const [couponDisposable] = await db
    .insert(dbSchema.couponDisposables)
    .values(params)
    .returning();

  return couponDisposable;
};

export const createCouponTicketPayment = async (
  params: ICouponTicketPaymentCreate,
  db: TransactionClient,
): Promise<ICouponTicketPayment> => {
  const [couponTicketPayment] = await db
    .insert(dbSchema.couponTicketPayments)
    .values(params)
    .returning();

  return couponTicketPayment;
};

export const createCouponCriteria = async (
  params: ICouponCriteriaCreate,
  db: TransactionClient,
): Promise<ICouponCriteria> => {
  switch (params.type) {
    case 'all':
      const [couponAllCriteria] = await db
        .insert(dbSchema.couponAllCriteria)
        .values(params)
        .returning();
      return typia.assert<ICouponAllCriteria>(couponAllCriteria);

    case 'category':
      const [couponCategoryCriteria] = await db
        .insert(dbSchema.couponCategoryCriteria)
        .values(params)
        .returning();
      return typia.assert<ICouponCategoryCriteria>(couponCategoryCriteria);

    case 'teacher':
      const [couponTeacherCriteria] = await db
        .insert(dbSchema.couponTeacherCriteria)
        .values(params)
        .returning();
      return typia.assert<ICouponTeacherCriteria>(couponTeacherCriteria);

    case 'course':
      const [couponCourseCriteria] = await db
        .insert(dbSchema.couponCourseCriteria)
        .values(params)
        .returning();
      return typia.assert<ICouponCourseCriteria>(couponCourseCriteria);

    case 'ebook':
      const [couponEbookCriteria] = await db
        .insert(dbSchema.couponEbookCriteria)
        .values(params)
        .returning();
      return typia.assert<ICouponEbookCriteria>(couponEbookCriteria);
  }
};

export const seedCoupons = async (
  { count, user }: { count: number; user?: IUserWithoutPassword },
  db: TransactionClient,
): Promise<ICouponTicketRelations[]> => {
  const couponOwner = user ?? (await seedUsers({ count: 1 }, db))[0].user;
  const createManyParams: ICouponCreate[] = Array.from(
    { length: count },
    (_, i) => ({
      ...typia.random<ICouponCreate>(),
      expiredAt: null,
      expiredIn: null,
      name: `coupon-${i}`,
    }),
  );

  const coupons = await createManyCoupons(createManyParams, db);
  const tickets = await Promise.all(
    coupons.map((coupon) =>
      createCouponTicket(
        {
          couponId: coupon.id,
          userId: couponOwner.id,
          expiredAt: null,
          couponDisposableId: null,
        },
        db,
      ),
    ),
  );

  const criteria = await Promise.all(
    coupons.map((coupon) =>
      createCouponCriteria(
        {
          type: 'all',
          couponId: coupon.id,
          direction: 'include',
        },
        db,
      ),
    ),
  );

  return coupons.map((coupon) => ({
    ...coupon,
    ticket: tickets.find((ticket) => ticket.couponId === coupon.id)!,
    couponAllCriteria: criteria.filter(
      (c) => c.type === 'all' && c.couponId === coupon.id,
    ) as ICouponAllCriteria[],
    couponCategoryCriteria: criteria.filter(
      (c) => c.type === 'category' && c.couponId === coupon.id,
    ) as ICouponCategoryCriteria[],
    couponCourseCriteria: criteria.filter(
      (c) => c.type === 'course' && c.couponId === coupon.id,
    ) as ICouponCourseCriteria[],
    couponEbookCriteria: criteria.filter(
      (c) => c.type === 'ebook' && c.couponId === coupon.id,
    ) as ICouponEbookCriteria[],
    couponTeacherCriteria: criteria.filter(
      (c) => c.type === 'teacher' && c.couponId === coupon.id,
    ) as ICouponTeacherCriteria[],
  }));
};
