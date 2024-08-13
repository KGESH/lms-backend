import 'dotenv/config';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';
import { dbSchema } from './src/infra/db/schema';
import { drizzle } from 'drizzle-orm/node-postgres';
import { sql } from 'drizzle-orm';
import { IS_PRODUCTION } from './src/shared/utils/is-production';
import { seedUiRepeatTimer } from './test/e2e/helpers/db/ui/repeat-timer.helper';
import { seedCarouselReview } from './test/e2e/helpers/db/ui/carousel-review.helper';
import { seedUsers } from './test/e2e/helpers/db/lms/user.helper';
import { seedTeachers } from './test/e2e/helpers/db/lms/teacher.helper';
import { seedCourseProducts } from './test/e2e/helpers/db/lms/course-product.helper';

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
  const confirmDatabaseReady = await db.execute(sql`SELECT 1`);

  console.debug(`[Test container ready]`, confirmDatabaseReady.rowCount);
  console.debug('[Test container uri]', connectionString);

  // Seed data
  await db.transaction(async (tx) => {
    await seedUiRepeatTimer({ count: 2 }, tx);
    await seedCarouselReview({ count: 4 }, tx);
    await seedTeachers({ count: 2 }, tx);
    await seedUsers({ count: 3 }, tx);
    await seedCourseProducts({ count: 5 }, tx);
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
