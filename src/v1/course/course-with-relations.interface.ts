import { ICourse } from './course.interface';
import { ITeacherWithoutPassword } from '../teacher/teacher.interface';
import { ICategory } from '../category/category.interface';
import { IChapter } from './chapter/chapter.interface';
import { ILesson } from './chapter/lesson/lesson.interface';
import { ILessonContent } from './chapter/lesson/lesson-content/lesson-content.interface';

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
