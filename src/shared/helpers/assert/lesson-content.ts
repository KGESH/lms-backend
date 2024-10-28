import * as typia from 'typia';
import { ILessonContentWithFile } from '@src/v1/course/chapter/lesson/lesson-content/lesson-content.interface';

export const assertLessonContentWithFile = (
  lessonContentWithFile: ILessonContentWithFile,
): ILessonContentWithFile =>
  typia.assert<ILessonContentWithFile>(lessonContentWithFile);
