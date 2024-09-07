import { Price, ProductType, Uuid } from '@src/shared/types/primitive';
import { Optional } from '@src/shared/types/optional';

export type IOrder = {
  id: Uuid;
  userId: Uuid;
  paymentId: string | null;
  txId: string | null;
  productType: ProductType;
  title: string;
  description: string | null;
  paymentMethod: string;
  amount: Price;
  paidAt: Date | null;
};

export type IOrderCreate = Optional<IOrder, 'id'>;
