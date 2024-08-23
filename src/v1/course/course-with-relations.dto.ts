import { CourseDto } from '@src/v1/course/course.dto';
import { TeacherDto } from '@src/v1/teacher/teacher.dto';
import { ChapterDto } from '@src/v1/course/chapter/chapter.dto';
import { LessonDto } from '@src/v1/course/chapter/lesson/lesson.dto';
import { LessonContentDto } from '@src/v1/course/chapter/lesson/lesson-content/lesson-content.dto';
import { CourseCategoryDto } from '@src/v1/course/category/course-category.dto';

export type LessonWithRelationsDto = LessonDto & {
  lessonContents: LessonContentDto[];
};

export type ChapterWithRelationsDto = ChapterDto & {
  lessons: LessonWithRelationsDto[];
};

export type CourseWithRelationsDto = CourseDto & {
  teacher: TeacherDto;
  category: CourseCategoryDto;
  chapters: ChapterWithRelationsDto[];
};
