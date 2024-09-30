import { INestApplication } from '@nestjs/common';
import * as UserAPI from '../../../src/api/functional/v1/user';
import { Uri } from '../../../src/shared/types/primitive';
import { createTestingServer } from '../helpers/app.helper';
import { ConfigsService } from '../../../src/configs/configs.service';
import { seedUsers } from '../helpers/db/lms/user.helper';
import { DrizzleService } from '../../../src/infra/db/drizzle.service';

describe('UserController (e2e)', () => {
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

  describe('[GET Me]', () => {
    it('should be get current user', async () => {
      const { user, userSession, userAccount, userInfo } = (
        await seedUsers({ count: 1, role: 'user' }, drizzle.db)
      )[0];

      const response = await UserAPI.me.getCurrentUser({
        host,
        headers: {
          LmsSecret,
          UserSessionId: userSession.id,
        },
      });
      if (!response.success) {
        const message = JSON.stringify(response.data, null, 4);
        throw new Error(`assert - ${message}`);
      }

      const me = response.data;
      expect(me.user.email).toBe(user.email);
      expect(me.info.name).toBe(userInfo.name);
      expect(me.info.gender).toBe(userInfo.gender);
      expect(me.info.phoneNumber).toBe(userInfo.phoneNumber);
      expect(me.account.providerId).toBe(userAccount.providerId);
      expect(me.account.providerType).toBe(userAccount.providerType);
    });
  });
});
