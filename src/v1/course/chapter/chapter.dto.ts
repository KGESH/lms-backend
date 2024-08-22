import { UInt, Uuid } from '@src/shared/types/primitive';
import { CourseCreateDto } from '@src/v1/course/course.dto';

export type ChapterDto = {
  id: Uuid;
  courseId: Uuid;
  title: string;
  description: string | null;
  sequence: UInt;
};

export type ChapterCreateDto = Pick<
  ChapterDto,
  'title' | 'description' | 'sequence'
>;

export type ChapterUpdateDto = Omit<Partial<CourseCreateDto>, 'teacherId'>;
