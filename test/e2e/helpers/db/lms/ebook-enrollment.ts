import { TransactionClient } from '@src/infra/db/drizzle.types';
import { dbSchema } from '@src/infra/db/schema';
import {
  IEbookEnrollment,
  IEbookEnrollmentCreate,
} from '@src/v1/ebook/enrollment/ebook-enrollment.interface';

export const createEbookEnrollment = async (
  params: IEbookEnrollmentCreate,
  db: TransactionClient,
): Promise<IEbookEnrollment> => {
  const [enrollment] = await db
    .insert(dbSchema.ebookEnrollments)
    .values(params)
    .returning();

  return enrollment;
};
