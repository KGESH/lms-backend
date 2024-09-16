import { INestApplication } from '@nestjs/common';
import * as PurchasedUserDashboardAPI from '../../../src/api/functional/v1/dashboard/user/purchased';
import { createTestingServer } from '../helpers/app.helper';
import { Uri } from '@src/shared/types/primitive';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import { ConfigsService } from '@src/configs/configs.service';
import { seedUsers } from '../helpers/db/lms/user.helper';
import { seedCourseOrders } from '../helpers/db/lms/order.helper';

describe('UserDashboardController (e2e)', () => {
  let host: Uri;
  let app: INestApplication;
  let drizzle: DrizzleService;
  let configs: ConfigsService;
  let LmsSecret: string;

  beforeEach(async () => {
    app = await createTestingServer();
    host = await app.getUrl();
    drizzle = await app.get(DrizzleService);
    configs = await app.get(ConfigsService);
    LmsSecret = configs.env.LMS_SECRET;
  });

  afterEach(async () => {
    await app.close();
  });

  describe('[Get purchased users]', () => {
    it('should be get many purchased users success', async () => {
      const [admin] = await seedUsers({ count: 1, role: 'admin' }, drizzle.db);
      const [firstUser] = await seedCourseOrders({ count: 3 }, drizzle.db);

      const response =
        await PurchasedUserDashboardAPI.course.findPurchasedCourseUsers(
          {
            host,
            headers: {
              LmsSecret,
              UserSessionId: admin.userSession.id,
            },
          },
          firstUser.product.courseId,
        );
      if (!response.success) {
        const message = JSON.stringify(response.data, null, 4);
        throw new Error(`assert - ${message}`);
      }

      const purchasedUsers = response.data;
      expect(
        purchasedUsers.find((user) => user.id === firstUser.user.id),
      ).toBeDefined();
    });
  });
});
