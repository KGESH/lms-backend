import { ISO8601, Price, Uuid } from '@src/shared/types/primitive';

export type EbookOrderDto = {
  id: Uuid;
  userId: Uuid;
  productSnapshotId: Uuid;
  paymentMethod: string;
  amount: Price;
  paidAt: ISO8601 | null;
};
