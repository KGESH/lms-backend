import { TransactionClient } from '../../infra/db/drizzle.types';
import { IS_PRODUCTION } from '../utils/is-production';
import { sql } from 'drizzle-orm';

type TableNameRow = {
  table_name: string;
};

export const clearDatabase = async (db: TransactionClient) => {
  if (IS_PRODUCTION) {
    throw new Error('Do not run clearDatabase script in production!');
  }

  const query = sql<TableNameRow>`SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_type = 'BASE TABLE';
    `;

  const tables = await db.execute<TableNameRow>(query);

  for (const table of tables.rows) {
    const query = sql.raw(`TRUNCATE TABLE "${table.table_name}" CASCADE;`);
    await db.execute(query);
  }
};
