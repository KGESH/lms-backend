import { UInt, Uuid } from '@src/shared/types/primitive';
import { Optional } from '@src/shared/types/optional';

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
