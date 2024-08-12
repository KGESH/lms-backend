import { UInt, Uuid } from '../../../shared/types/primitive';

export type ChapterDto = {
  id: Uuid;
  courseId: Uuid;
  title: string;
  description: string | null;
  sequence: UInt;
};

export type ChapterCreateDto = Pick<
  ChapterDto,
  'courseId' | 'title' | 'description' | 'sequence'
>;

export type ChapterUpdateDto = Partial<ChapterDto>;
