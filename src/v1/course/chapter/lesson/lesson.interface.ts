import { UInt, Uuid } from '../../../../shared/types/primitive';
import { Optional } from '../../../../shared/types/optional';

export type ILesson = {
  id: Uuid;
  chapterId: Uuid;
  title: string;
  description: string | null;
  sequence: UInt;
};

export type ILessonCreate = Pick<
  Optional<ILesson, 'id'>,
  'id' | 'chapterId' | 'title' | 'description' | 'sequence'
>;

export type ILessonUpdate = Omit<Partial<ILessonCreate>, 'id'>;
