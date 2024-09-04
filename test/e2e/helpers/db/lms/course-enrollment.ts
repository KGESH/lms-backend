import { TransactionClient } from '@src/infra/db/drizzle.types';
import { dbSchema } from '@src/infra/db/schema';
import {
  ICourseEnrollment,
  ICourseEnrollmentCreate,
} from '@src/v1/course/enrollment/course-enrollment.interface';
import {
  ICourseEnrollmentProgress,
  ICourseEnrollmentProgressCreate,
} from '@src/v1/course/enrollment/progress/course-enrollment-progress.interface';

export const createCourseEnrollment = async (
  params: ICourseEnrollmentCreate,
  db: TransactionClient,
): Promise<ICourseEnrollment> => {
  const [enrollment] = await db
    .insert(dbSchema.courseEnrollments)
    .values(params)
    .returning();

  return enrollment;
};

export const createCourseEnrollmentProgress = async (
  params: ICourseEnrollmentProgressCreate,
  db: TransactionClient,
): Promise<ICourseEnrollmentProgress> => {
  const [enrollment] = await db
    .insert(dbSchema.courseEnrollmentProgresses)
    .values(params)
    .returning();

  return enrollment;
};
