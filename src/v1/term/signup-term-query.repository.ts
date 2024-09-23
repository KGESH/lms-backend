import { Injectable } from '@nestjs/common';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import { ISignupFormTerm } from '@src/v1/term/term.interface';

@Injectable()
export class SignupTermQueryRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async findSignupFormTerms(): Promise<ISignupFormTerm[]> {
    const signupTerms = await this.drizzle.db.query.signupTerms.findMany({
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
