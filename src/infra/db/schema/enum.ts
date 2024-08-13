import { pgEnum } from 'drizzle-orm/pg-core';

export const discountType = pgEnum('discount_type', [
  'fixed_amount',
  'percent',
]);
