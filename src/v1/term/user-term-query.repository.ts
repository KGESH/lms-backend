import { Injectable } from '@nestjs/common';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import { IUserAgreedTerm, IUserTerm } from '@src/v1/term/term.interface';
import { eq } from 'drizzle-orm';
import { dbSchema } from '@src/infra/db/schema';

@Injectable()
export class UserTermQueryRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async findUserTerms(
    where: Pick<IUserTerm, 'userId'>,
  ): Promise<IUserAgreedTerm[]> {
    const userTerms = await this.drizzle.db.query.userTerms.findMany({
      where: eq(dbSchema.userTerms.userId, where.userId),
      with: {
        term: {
          with: {
            snapshots: {
              orderBy: (snapshot, { desc }) => desc(snapshot.createdAt),
              limit: 1,
            },
          },
        },
      },
    });

    return userTerms.map(({ term, ...userTerm }) => ({
      ...term,
      snapshot: term.snapshots[0],
      userTerm,
    }));
  }
}
