import { Uuid } from '../../../../../shared/types/primitive';
import { Optional } from '../../../../../shared/types/optional';

export type ICourseProductSnapshotContent = {
  id: Uuid;
  courseProductSnapshotId: Uuid;
  richTextContent: string;
};

export type ICourseProductSnapshotContentCreate = Optional<
  ICourseProductSnapshotContent,
  'id'
>;
