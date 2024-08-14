import { Uuid } from '../../../../shared/types/primitive';
import { Optional } from '../../../../shared/types/optional';

export type ICourseProductSnapshot = {
  id: Uuid;
  courseProductId: Uuid;
  title: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
};

export type ICourseProductSnapshotCreate = Pick<
  Optional<ICourseProductSnapshot, 'id'>,
  'id' | 'courseProductId' | 'title' | 'description'
>;
