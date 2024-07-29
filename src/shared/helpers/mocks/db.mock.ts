import { PostgreSqlContainer } from '@testcontainers/postgresql';
import * as path from 'path';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { IS_PRODUCTION } from '../../utils/is-production';
import { drizzle } from 'drizzle-orm/node-postgres';
import { dbSchema } from '../../../infra/db/schema';
import { Pool } from 'pg';
import { sql } from 'drizzle-orm';

/**
 * @description
 * 로컬 환경에서 실행되는 DB 컨테이너를 생성합니다.
 *
 * @return
 * connectionString - 테스트 데이터베이스 컨테이너 URL
 */
export const createTestDbContainer = async (): Promise<string> => {
  if (IS_PRODUCTION) {
    throw new Error('Do not run test db container in production!');
  }
  const container = await new PostgreSqlContainer()
    .withDatabase('postgres')
    .withUsername('postgres')
    .withPassword('postgres')
    .start();

  const connectionString = container.getConnectionUri();
  const migrationPath = path.join(process.cwd(), 'drizzle');
  const pool = new Pool({ connectionString });
  const db = drizzle(pool, { schema: dbSchema });

  await migrate(db, { migrationsFolder: migrationPath });
  const confirmDatabaseReady = await db.execute(sql`SELECT 1`);

  console.debug(`[Test container ready]`, confirmDatabaseReady.rowCount);
  console.debug('[Test container uri]', connectionString);

  return connectionString;
};
