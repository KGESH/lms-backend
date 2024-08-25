import { UInt, Uuid } from '@src/shared/types/primitive';

export type ChapterDto = {
  id: Uuid;
  courseId: Uuid;
  title: string;
  description: string | null;
  sequence: UInt;
};

export type ChapterCreateDto = Pick<ChapterDto, 'title' | 'description'>;

export type ChapterUpdateDto = Partial<
  Pick<ChapterDto, 'title' | 'description' | 'sequence'>
>;
