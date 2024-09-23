import { Injectable } from '@nestjs/common';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import { IUserTerm, IUserTermCreate } from '@src/v1/term/term.interface';
import { dbSchema } from '@src/infra/db/schema';

@Injectable()
export class UserTermRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async createManyUserTerms(
    params: IUserTermCreate[],
    db = this.drizzle.db,
  ): Promise<IUserTerm[]> {
    const userTerms = await db
      .insert(dbSchema.userTerms)
      .values(params)
      .returning();
    return userTerms;
  }
}
