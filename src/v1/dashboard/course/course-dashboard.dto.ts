import { LessonDto } from '@src/v1/course/chapter/lesson/lesson.dto';
import { ChapterDto } from '@src/v1/course/chapter/chapter.dto';
import { LessonContentDto } from '@src/v1/course/chapter/lesson/lesson-content/lesson-content.dto';

export type ChapterSequenceUpdateDto = Pick<ChapterDto, 'id' | 'sequence'>;

export type LessonSequenceUpdateDto = Pick<LessonDto, 'id' | 'sequence'>;

export type CourseDashboardUpdateDto = {
  chapters: ChapterSequenceUpdateDto[];
  lessons: LessonSequenceUpdateDto[];
};

export type CourseDashboardDto = {
  chapters: ChapterDto[];
  lessons: LessonDto[];
};

export type CourseDashboardLessonContentDto = Pick<
  LessonContentDto,
  'id' | 'contentType' | 'sequence'
>;
