import { Injectable } from '@nestjs/common';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import { ISignupTerm, ISignupTermCreate } from '@src/v1/term/term.interface';
import { dbSchema } from '@src/infra/db/schema';

@Injectable()
export class SignupTermRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async createManySignupFormTerms(
    params: ISignupTermCreate[],
    db = this.drizzle.db,
  ): Promise<ISignupTerm[]> {
    const signupTerms = await db
      .insert(dbSchema.signupTerms)
      .values(params)
      .returning();
    return signupTerms;
  }
}
