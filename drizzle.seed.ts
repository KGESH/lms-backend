import 'dotenv/config';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';
import { dbSchema } from './src/infra/db/schema';
import { drizzle } from 'drizzle-orm/node-postgres';
import { sql } from 'drizzle-orm';
import { IS_PRODUCTION } from './src/shared/utils/is-production';
import { seedUiRepeatTimer } from './test/e2e/helpers/db/ui/repeat-timer.helper';
import { seedCarouselReview } from './test/e2e/helpers/db/ui/carousel-review.helper';
import {
  seedAdminUser,
  seedPgUsers,
  seedUsers,
} from './test/e2e/helpers/db/lms/user.helper';
import { seedTeachers } from './test/e2e/helpers/db/lms/teacher.helper';
import { seedCourseProducts } from './test/e2e/helpers/db/lms/course-product.helper';
import { clearDatabase } from './src/shared/helpers/db';
import {
  seedCourseReviews,
  seedEbookReviews,
} from './test/e2e/helpers/db/lms/review.helper';
import {
  seedCourseOrders,
  seedEbookOrders,
} from './test/e2e/helpers/db/lms/order.helper';
import { seedCourseCategoriesWithChildren } from './test/e2e/helpers/db/lms/course-category.helper';
import { seedEbooks } from './test/e2e/helpers/db/lms/ebook.helper';
import { seedEbookProducts } from './test/e2e/helpers/db/lms/ebook-product.helper';
import { seedPosts } from './test/e2e/helpers/db/lms/post.helper';
import { seedNavbarCategories } from './test/e2e/helpers/db/lms/post-category.helper';
import { seedCoupons } from './test/e2e/helpers/db/lms/coupon.helper';

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
    await seedCourseCategoriesWithChildren({ count: 3 }, db);
    await seedUiRepeatTimer({ count: 2 }, db, '/');
    await seedCarouselReview({ count: 4 }, db, '/');
    await seedTeachers({ count: 2 }, db);
    await seedUsers({ count: 3, role: 'user' }, db);
    await seedUsers({ count: 1, role: 'manager' }, db);
    await seedUsers({ count: 1, role: 'teacher' }, db);
    await seedAdminUser(
      {
        email: env.get('ADMIN_EMAIL'),
        password: env.get('ADMIN_PASSWORD'),
      },
      db,
    );
    const [testPgUser] = await seedPgUsers(db);
    await seedCourseProducts({ count: 3 }, db);
    await seedCourseReviews({ count: 3 }, db);
    await seedCourseOrders({ count: 3 }, db);
    await seedEbookOrders({ count: 3 }, db);
    await seedEbooks({ count: 3 }, db);
    await seedEbookProducts({ count: 3 }, db);
    await seedEbookReviews({ count: 3 }, db);
    await seedPosts({ count: 3 }, db);
    await seedNavbarCategories(db);
    await seedCoupons({ count: 3, user: testPgUser.user }, db);
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
