import { ITeacherWithoutPassword } from '@src/v1/teacher/teacher.interface';
import { ICategory } from '@src/v1/course/category/category.interface';
import { ICourse } from '@src/v1/course/course.interface';
import { IChapter } from '@src/v1/course/chapter/chapter.interface';
import { ILesson } from '@src/v1/course/chapter/lesson/lesson.interface';
import { ILessonContent } from '@src/v1/course/chapter/lesson/lesson-content/lesson-content.interface';

export type ILessonWithRelations = ILesson & {
  lessonContents: ILessonContent[];
};

export type IChapterWithRelations = IChapter & {
  lessons: ILessonWithRelations[];
};

export type ICourseWithRelations = ICourse & {
  teacher: ITeacherWithoutPassword;
  category: ICategory;
  chapters: IChapterWithRelations[];
};
