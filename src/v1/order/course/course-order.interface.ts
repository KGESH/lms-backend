import { Uuid } from '../../../shared/types/primitive';
import { Optional } from '../../../shared/types/optional';

export type ICourseOrder = {
  id: Uuid;
  userId: Uuid;
  courseProductSnapshotId: Uuid;
  paymentMethod: string;
  amount: string;
  paidAt: Date | null;
};

export type ICourseOrderCreate = Optional<ICourseOrder, 'id'>;
