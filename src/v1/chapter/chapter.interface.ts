import { Uuid } from '../../shared/types/primitive';

export type IChapter = {
  id: Uuid;
  courseId: Uuid;
  title: string;
  description: string | null;
  sequence: number;
};

export type IChapterCreate = Pick<
  IChapter,
  'courseId' | 'title' | 'description' | 'sequence'
>;
