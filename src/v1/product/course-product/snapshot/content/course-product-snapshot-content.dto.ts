import { Uuid } from '../../../../../shared/types/primitive';

export type CourseProductSnapshotContentDto = {
  id: Uuid;
  courseProductSnapshotId: Uuid;
  richTextContent: string;
};
