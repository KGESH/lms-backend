import { ILesson } from '@src/v1/course/chapter/lesson/lesson.interface';
import { IChapter } from '@src/v1/course/chapter/chapter.interface';

export type IChapterSequenceUpdate = Pick<IChapter, 'id' | 'sequence'>;

export type ILessonSequenceUpdate = Pick<ILesson, 'id' | 'sequence'>;

export type ICourseDashboardUpdate = {
  chapters: IChapterSequenceUpdate[];
  lessons: ILessonSequenceUpdate[];
};
