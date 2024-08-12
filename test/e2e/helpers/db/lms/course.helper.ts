import { DrizzleService } from '../../../../../src/infra/db/drizzle.service';
import { dbSchema } from '../../../../../src/infra/db/schema';
import { eq } from 'drizzle-orm';
import {
  ICourse,
  ICourseCreate,
} from '../../../../../src/v1/course/course.interface';

export const findCourse = async (
  where: Pick<ICourse, 'id'>,
  drizzle: DrizzleService,
): Promise<ICourse | null> => {
  const course = await drizzle.db.query.courses.findFirst({
    where: eq(dbSchema.courses.id, where.id),
  });
  return course ?? null;
};

export const createCourse = async (
  params: ICourseCreate,
  drizzle: DrizzleService,
): Promise<ICourse> => {
  const [course] = await drizzle.db
    .insert(dbSchema.courses)
    .values(params)
    .returning();

  return course;
};
