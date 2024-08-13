import { Uuid } from '../../../shared/types/primitive';
import { Optional } from '../../../shared/types/optional';

export type ICourseProductSnapshot = {
  id: Uuid;
  courseProductId: Uuid;
  title: string;
  description: string | null;
};

export type ICourseProductSnapshotCreate = Optional<
  ICourseProductSnapshot,
  'id'
>;
