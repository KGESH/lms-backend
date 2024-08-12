import { CourseDto } from './course.dto';
import { TeacherDto } from '../teacher/teacher.dto';
import { CategoryDto } from '../category/category.dto';
import { ChapterDto } from './chapter/chapter.dto';
import { LessonDto } from './chapter/lesson/lesson.dto';
import { LessonContentDto } from './chapter/lesson/lesson-content/lesson-content.dto';

export type LessonWithRelationsDto = LessonDto & {
  lessonContents: LessonContentDto[];
};

export type ChapterWithRelationsDto = ChapterDto & {
  lessons: LessonWithRelationsDto[];
};

export type CourseWithRelationsDto = CourseDto & {
  teacher: TeacherDto;
  category: CategoryDto;
  chapters: ChapterWithRelationsDto[];
};
