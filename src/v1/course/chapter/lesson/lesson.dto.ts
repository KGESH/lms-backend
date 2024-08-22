import { UInt, Uuid } from '@src/shared/types/primitive';

export type LessonDto = {
  id: Uuid;
  chapterId: Uuid;
  title: string;
  description: string | null;
  sequence: UInt;
};

export type LessonCreateDto = Pick<
  LessonDto,
  'title' | 'description' | 'sequence'
>;

export type LessonUpdateDto = Partial<LessonDto>;
