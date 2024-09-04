import { INestApplication } from '@nestjs/common';
import * as UserAPI from '../../../src/api/functional/v1/user';
import * as typia from 'typia';
import { Uri, Uuid } from '../../../src/shared/types/primitive';
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

  describe('[GET User]', () => {
    it('should be get null', async () => {
      const { userSession } = (
        await seedUsers({ count: 1, role: 'admin' }, drizzle.db)
      )[0];
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
        const message = JSON.stringify(response.data, null, 4);
        throw new Error(`assert - ${message}`);
      }

      expect(response.data).toBe(null);
    });
  });

  describe('[GET Me]', () => {
    it('should be get current user', async () => {
      const { user, userSession } = (
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

      const currentUser = response.data;
      expect(currentUser.email).toBe(user.email);
    });
  });

  describe('[Get Users]', () => {
    it('should be search users by email success', async () => {
      const admin = (
        await seedUsers({ count: 1, role: 'admin' }, drizzle.db)
      )[0];
      const STUDENT_USER_COUNT = 5;
      const students = await seedUsers(
        { count: STUDENT_USER_COUNT, role: 'user' },
        drizzle.db,
      );
      const targetStudent = students[0];

      const searchByEmailResponse = await UserAPI.getUsers(
        {
          host,
          headers: {
            LmsSecret,
            UserSessionId: admin.userSession.id,
          },
        },
        {
          role: 'user',
          email: targetStudent.user.email.slice(0, 3),
          page: 1,
          pageSize: 10,
          orderBy: 'asc',
        },
      );
      if (!searchByEmailResponse.success) {
        const message = JSON.stringify(searchByEmailResponse.data, null, 4);
        throw new Error(`assert - ${message}`);
      }

      const { data: foundUsers } = searchByEmailResponse.data;
      expect(
        foundUsers.find((user) => user.email === targetStudent.user.email),
      ).toBeDefined();
    });

    it('should be search users by nickname success', async () => {
      const admin = (
        await seedUsers({ count: 1, role: 'admin' }, drizzle.db)
      )[0];
      const STUDENT_USER_COUNT = 5;
      const students = await seedUsers(
        { count: STUDENT_USER_COUNT, role: 'user' },
        drizzle.db,
      );
      const targetStudent = students[0];

      const searchByNicknameResponse = await UserAPI.getUsers(
        {
          host,
          headers: {
            LmsSecret,
            UserSessionId: admin.userSession.id,
          },
        },
        {
          role: 'user',
          displayName: targetStudent.user.displayName.slice(0, 3),
          page: 1,
          pageSize: 10,
          orderBy: 'asc',
        },
      );
      if (!searchByNicknameResponse.success) {
        const message = JSON.stringify(searchByNicknameResponse.data, null, 4);
        throw new Error(`assert - ${message}`);
      }

      expect(
        searchByNicknameResponse.data.data.find(
          (user) => user.displayName === targetStudent.user.displayName,
        ),
      ).toBeDefined();
    });

    it('should be search users by name success', async () => {
      const admin = (
        await seedUsers({ count: 1, role: 'admin' }, drizzle.db)
      )[0];
      const STUDENT_USER_COUNT = 5;
      const students = await seedUsers(
        { count: STUDENT_USER_COUNT, role: 'user' },
        drizzle.db,
      );
      const targetStudent = students[0];

      const searchByNameResponse = await UserAPI.getUsers(
        {
          host,
          headers: {
            LmsSecret,
            UserSessionId: admin.userSession.id,
          },
        },
        {
          role: 'user',
          name: targetStudent.userInfo.name.slice(0, 2),
          page: 1,
          pageSize: 10,
          orderBy: 'asc',
        },
      );
      if (!searchByNameResponse.success) {
        const message = JSON.stringify(searchByNameResponse.data, null, 4);
        throw new Error(`assert - ${message}`);
      }

      expect(
        searchByNameResponse.data.data.find(
          (user) => user.displayName === targetStudent.user.displayName,
        ),
      ).toBeDefined();
    });

    it('should be get one user success', async () => {
      const admin = (
        await seedUsers({ count: 1, role: 'admin' }, drizzle.db)
      )[0];
      const STUDENT_USER_COUNT = 5;
      const students = await seedUsers(
        { count: STUDENT_USER_COUNT, role: 'user' },
        drizzle.db,
      );

      const response = await UserAPI.getUsers(
        {
          host,
          headers: {
            LmsSecret,
            UserSessionId: admin.userSession.id,
          },
        },
        {
          role: 'user',
          page: 1,
          pageSize: 3,
          orderBy: 'asc',
        },
      );
      if (!response.success) {
        const message = JSON.stringify(response.data, null, 4);
        throw new Error(`assert - ${message}`);
      }

      const { data: users, pagination, totalCount } = response.data;

      expect(users.length).toEqual(3);
      expect(pagination.page).toEqual(1);
      expect(pagination.pageSize).toEqual(3);
      expect(totalCount).toEqual(STUDENT_USER_COUNT);
    });
  });
});
