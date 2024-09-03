import { CourseWithRelationsDto } from '@src/v1/course/course-with-relations.dto';
import { ICourseWithRelations } from '@src/v1/course/course-with-relations.interface';
import * as date from '@src/shared/utils/date';
import { teacherToDto } from './teacher';
import { ICourse } from '@src/v1/course/course.interface';
import { CourseDto } from '@src/v1/course/course.dto';

export const courseToDto = (course: ICourse): CourseDto => {
  return {
    ...course,
    createdAt: date.toISOString(course.createdAt),
    updatedAt: date.toISOString(course.updatedAt),
  };
};

export const courseRelationsToDto = (
  courseWithRelations: ICourseWithRelations,
): CourseWithRelationsDto => {
  console.log(
    '[COURSE WITH RELATIONS]',
    JSON.stringify(courseWithRelations, null, 4),
  );
  return {
    ...courseWithRelations,
    createdAt: date.toISOString(courseWithRelations.createdAt),
    updatedAt: date.toISOString(courseWithRelations.updatedAt),
    teacher: teacherToDto(courseWithRelations.teacher),
  };
};
