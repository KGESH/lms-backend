import { UInt, Uuid } from '../../../shared/types/primitive';
import { Optional } from '../../../shared/types/optional';

export type IChapter = {
  id: Uuid;
  courseId: Uuid;
  title: string;
  description: string | null;
  sequence: UInt;
};

export type IChapterCreate = Pick<
  Optional<IChapter, 'id'>,
  'id' | 'courseId' | 'title' | 'description' | 'sequence'
>;

export type IChapterUpdate = Omit<Partial<IChapterCreate>, 'id'>;
