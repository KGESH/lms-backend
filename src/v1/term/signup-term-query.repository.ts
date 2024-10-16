import { Injectable } from '@nestjs/common';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import { ISignupFormTerm } from '@src/v1/term/term.interface';
import { dbSchema } from '@src/infra/db/schema';
import { and, eq, isNull } from 'drizzle-orm';

@Injectable()
export class SignupTermQueryRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async findSignupFormTerm(
    where: Pick<ISignupFormTerm, 'id'>,
  ): Promise<ISignupFormTerm | null> {
    const signupTerm = await this.drizzle.db.query.signupTerms.findFirst({
      where: and(
        eq(dbSchema.signupTerms.id, where.id),
        isNull(dbSchema.signupTerms.deletedAt),
      ),
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

    if (!signupTerm) {
      return null;
    }

    return {
      ...signupTerm.term,
      snapshot: signupTerm.term.snapshots[0],
      signupTerm,
    };
  }

  async findSignupFormTerms(): Promise<ISignupFormTerm[]> {
    const signupTerms = await this.drizzle.db.query.signupTerms.findMany({
      where: isNull(dbSchema.signupTerms.deletedAt),
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

    return signupTerms.map((t) => ({
      ...t.term,
      snapshot: t.term.snapshots[0],
      signupTerm: t,
    }));
  }
}
