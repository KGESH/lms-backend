import 'dotenv/config';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';
import { dbSchema } from './src/infra/db/schema';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as path from 'path';
import { sql } from 'drizzle-orm';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { IS_PRODUCTION } from './src/shared/utils/is-production';
import { seedUiRepeatTimer } from './test/e2e/helpers/db/ui/repeat-timer.helper';
import { seedCarouselReview } from './test/e2e/helpers/db/ui/carousel-review.helper';

const env = new ConfigService();

async function seed() {
  if (IS_PRODUCTION) {
    throw new Error('Do not run seed script in production!');
  }

  const connectionString = env.get('DATABASE_URL');
  if (!connectionString) {
    throw new Error(
      'DATABASE_URL is not provided. Check your environment variables.',
    );
  }

  const pool = new Pool({ connectionString });
  const db = drizzle(pool, { schema: dbSchema });
  // const migrationPath = path.join(process.cwd(), 'drizzle');

  // await migrate(db, { migrationsFolder: migrationPath });
  const confirmDatabaseReady = await db.execute(sql`SELECT 1`);

  console.debug(`[Test container ready]`, confirmDatabaseReady.rowCount);
  console.debug('[Test container uri]', connectionString);

  // Seed data
  await db.transaction(async (tx) => {
    await seedUiRepeatTimer(tx);
    await seedCarouselReview(tx);
  });
}

seed()
  .then(() => {
    console.log('Seed completed.');
    process.exit(0);
  })
  .catch((e) => {
    console.error('Seed failed.');
    console.error(e);
    process.exit(1);
  });
