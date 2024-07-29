import { INestApplication } from '@nestjs/common';
import * as UserApis from '../../nestia/api/functional/v1/user';
import * as typia from 'typia';
import { IUserWithoutPassword } from '../../src/v1/user/user.interface';
import { Uri, Uuid } from '../../src/shared/types/primitive';
import { createTestingServer } from './app.helper';

describe('UserController (e2e)', () => {
  let host: Uri;
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestingServer();
    host = await app.getUrl();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('[GET User]', () => {
    it('should be get null', async () => {
      const randomId = typia.random<Uuid>();
      const response = await UserApis.getUser({ host }, randomId);

      expect(response.data).toBe(null);
    });
  });

  describe('[Get Users]', () => {
    it('should be get empty array', async () => {
      const response = await UserApis.getUsers({ host }, {});

      console.log('[Get Users]', response.data);

      expect(typia.is<IUserWithoutPassword[]>(response.data)).toEqual(true);
    });
  });
});
