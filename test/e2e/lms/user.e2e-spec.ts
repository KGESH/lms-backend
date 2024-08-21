import { INestApplication } from '@nestjs/common';
import * as UserAPI from '../../../src/api/functional/v1/user';
import * as typia from 'typia';
import { Uri, Uuid } from '../../../src/shared/types/primitive';
import { createTestingServer } from '../helpers/app.helper';
import { OmitPassword } from '../../../src/shared/types/omit-password';
import { IUser } from '../../../src/v1/user/user.interface';
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

  describe('[GET User]', () => {
    it('should be get null', async () => {
      const { userSession } = (await seedUsers({ count: 1 }, drizzle.db))[0];
      const randomId = typia.random<Uuid>();

      const response = await UserAPI.getUser(
        {
          host,
          headers: {
            LmsSecret,
            UserSessionId: userSession.id,
          },
        },
        randomId,
      );
      if (!response.success) {
        throw new Error('assert');
      }

      expect(response.data).toBe(null);
    });
  });

  describe('[Get Users]', () => {
    it('should be get empty array', async () => {
      const admin = (
        await seedUsers({ count: 1, role: 'admin' }, drizzle.db)
      )[0];

      const response = await UserAPI.getUsers(
        {
          host,
          headers: {
            LmsSecret,
            UserSessionId: admin.userSession.id,
          },
        },
        {
          page: 1,
          orderBy: 'asc',
          pageSize: 10,
        },
      );
      if (!response.success) {
        throw new Error('assert');
      }

      expect(typia.is<OmitPassword<IUser>[]>(response.data)).toEqual(true);
    });
  });
});
