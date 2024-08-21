import { UInt, Uuid } from '../../../shared/types/primitive';
import { CourseCreateDto } from '../course.dto';

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
