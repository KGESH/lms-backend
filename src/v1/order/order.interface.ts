import { Price, ProductType, Uuid } from '../../shared/types/primitive';
import { Optional } from '../../shared/types/optional';

export type IOrder = {
  id: Uuid;
  userId: Uuid;
  productType: ProductType;
  paymentMethod: string;
  amount: Price;
  paidAt: Date | null;
};

export type IOrderCreate = Optional<IOrder, 'id'>;
