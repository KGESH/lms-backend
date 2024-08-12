import { UInt, Uuid } from '../../../../shared/types/primitive';

export type ILesson = {
  id: Uuid;
  chapterId: Uuid;
  title: string;
  description: string | null;
  sequence: UInt;
};

export type ILessonCreate = Pick<
  ILesson,
  'chapterId' | 'title' | 'description' | 'sequence'
>;
