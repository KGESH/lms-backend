import { sql, SQLWrapper } from 'drizzle-orm';
import { TransactionClient } from '@src/infra/db/drizzle.types';

export const explainAnalyze = async <T extends SQLWrapper>(
  db: TransactionClient,
  query: T,
) => {
  const debugResult = await db.execute(sql`EXPLAIN ANALYZE ${query.getSQL()}`);
  console.debug(`[Explain Analyze]`, debugResult);
  return await query;
};
