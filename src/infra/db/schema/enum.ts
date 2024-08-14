import { pgEnum } from 'drizzle-orm/pg-core';

export const discountType = pgEnum('discount_type', [
  'fixed_amount',
  'percent',
]);

export const userRole = pgEnum('user_role', [
  'user',
  'teacher',
  'manager',
  'admin',
]);

export const authProvider = pgEnum('auth_provider', ['email', 'kakao']);
