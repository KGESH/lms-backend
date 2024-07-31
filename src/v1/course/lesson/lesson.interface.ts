import { Uuid } from '../../../shared/types/primitive';

export type ILesson = {
  id: Uuid;
  chapterId: Uuid;
  title: string;
  description: string | null;
  sequence: number;
};

export type ILessonCreate = Pick<
  ILesson,
  'chapterId' | 'title' | 'description' | 'sequence'
>;
