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
import { clearDatabase } from './src/shared/helpers/db';
import { seedCourseReviews } from './test/e2e/helpers/db/lms/review.helper';
import { seedCourseOrders } from './test/e2e/helpers/db/lms/order.helper';

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

  await clearDatabase(db);

  // Seed data
  try {
    await seedUiRepeatTimer({ count: 2 }, db);
    await seedCarouselReview({ count: 4 }, db);
    await seedTeachers({ count: 2 }, db);
    await seedUsers({ count: 3, role: 'user' }, db);
    await seedUsers({ count: 1, role: 'manager' }, db);
    await seedUsers({ count: 1, role: 'admin' }, db);
    await seedUsers({ count: 1, role: 'teacher' }, db);
    await seedCourseProducts({ count: 10 }, db);
    await seedCourseReviews({ count: 10 }, db);
    await seedCourseOrders({ count: 5 }, db);
  } catch (e) {
    console.error(e);
    await clearDatabase(db);
    throw new Error('Seed failed. Database is cleared.');
  } finally {
    await pool.end();
  }
}

seed()
  .then(() => {
    console.log('🌱 Seed completed.');
    process.exit(0);
  })
  .catch((e) => {
    console.error('❗️ Seed failed. maybe too many connection pool.');
    console.error(e);
    process.exit(1);
  });
