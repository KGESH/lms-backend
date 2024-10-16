import { Injectable } from '@nestjs/common';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import {
  ISignupTerm,
  ISignupTermCreate,
  ISignupTermUpdate,
} from '@src/v1/term/term.interface';
import { dbSchema } from '@src/infra/db/schema';
import { eq, inArray, sql, SQL } from 'drizzle-orm';
import * as date from '@src/shared/utils/date';

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

  async updateManySignupFormTermsSequence(
    params: ISignupTermUpdate[],
    db = this.drizzle.db,
  ): Promise<ISignupTerm[]> {
    if (params.length === 0) {
      return [];
    }

    const sqlChunks: SQL[] = [];
    const ids: ISignupTermUpdate['id'][] = [];

    sqlChunks.push(sql`(case`);
    for (const param of params) {
      sqlChunks.push(
        sql`when ${dbSchema.signupTerms.id} = ${param.id} then ${param.sequence}::integer`,
      );
      ids.push(param.id);
    }
    sqlChunks.push(sql`end)`);

    const finalSql: SQL = sql.join(sqlChunks, sql.raw(' '));

    const signupTerms = await db
      .update(dbSchema.signupTerms)
      .set({ sequence: finalSql })
      .where(inArray(dbSchema.signupTerms.id, ids))
      .returning();

    return signupTerms;
  }

  async deleteSignupFormTerm(
    where: Pick<ISignupTerm, 'id'>,
  ): Promise<ISignupTerm['id']> {
    await this.drizzle.db
      .update(dbSchema.signupTerms)
      .set({ deletedAt: date.now('date') })
      .where(eq(dbSchema.signupTerms.id, where.id));

    return where.id;
  }
}
