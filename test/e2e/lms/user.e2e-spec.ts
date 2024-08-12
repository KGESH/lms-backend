import { INestApplication } from '@nestjs/common';
import * as UserAPI from '../../../src/api/functional/v1/user';
import * as typia from 'typia';
import { Uri, Uuid } from '../../../src/shared/types/primitive';
import { createTestingServer } from '../helpers/app.helper';
import { OmitPassword } from '../../../src/shared/types/omit-password';
import { IUser } from '../../../src/v1/user/user.interface';

describe('UserController (e2e)', () => {
  let host: Uri;
  let app: INestApplication;

  beforeEach(async () => {
    app = await createTestingServer();
    host = await app.getUrl();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('[GET User]', () => {
    it('should be get null', async () => {
      const randomId = typia.random<Uuid>();
      const response = await UserAPI.getUser({ host }, randomId);
      if (!response.success) {
        throw new Error('assert');
      }

      expect(response.data).toBe(null);
    });
  });

  describe('[Get Users]', () => {
    it('should be get empty array', async () => {
      const response = await UserAPI.getUsers(
        { host },
        {
          cursor: null,
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
