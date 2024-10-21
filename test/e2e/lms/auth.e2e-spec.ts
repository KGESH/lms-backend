import { INestApplication } from '@nestjs/common';
import * as AuthAPI from '../../../src/api/functional/v1/auth';
import * as typia from 'typia';
import { createTestingServer } from '../helpers/app.helper';
import { SignUpUserDto, LoginUserDto } from '../../../src/v1/auth/auth.dto';
import { Uri } from '../../../src/shared/types/primitive';
import { DrizzleService } from '../../../src/infra/db/drizzle.service';
import { KakaoLoginDto } from '../../../src/v1/auth/kakao-auth.dto';
import * as UserHelper from '../helpers/db/lms/user.helper';
import { seedUsers } from '../helpers/db/lms/user.helper';
import { ConfigsService } from '../../../src/configs/configs.service';

describe('AuthController (e2e)', () => {
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

  describe('[Kakao Login]', () => {
    it('should kakao login success', async () => {
      const loginDto: KakaoLoginDto = {
        ...typia.random<KakaoLoginDto>(),
        birthDate: '1998-06-27',
        email: 'sample@gmail.com',
      };

      const response = await AuthAPI.kakao.login.kakaoLogin(
        {
          host,
          headers: { LmsSecret },
        },
        loginDto,
      );
      if (!response.success) {
        const message = JSON.stringify(response.data, null, 4);
        throw new Error(`[assert] ${message}`);
      }

      const user = response.data;
      expect(user.email).toEqual('sample@gmail.com');
    });
  });

  describe('[Signup]', () => {
    it('should be signup success', async () => {
      const userCreateParams: SignUpUserDto['userCreateParams'] = {
        ...typia.random<SignUpUserDto['userCreateParams']>(),
        password: 'mock-password',
      };
      const infoCreateParams: SignUpUserDto['infoCreateParams'] =
        typia.random<SignUpUserDto['infoCreateParams']>();
      const accountCreateParams: SignUpUserDto['accountCreateParams'] =
        typia.random<SignUpUserDto['accountCreateParams']>();
      const signupDto: SignUpUserDto = {
        userCreateParams,
        infoCreateParams,
        accountCreateParams,
        userTerms: [],
      };

      const response = await AuthAPI.signup(
        {
          host,
          headers: { LmsSecret },
        },
        signupDto,
      );
      if (!response.success) {
        const message = JSON.stringify(response.data, null, 4);
        throw new Error(`[assert] ${message}`);
      }

      const user = response.data;
      expect(user.email).toEqual(signupDto.userCreateParams.email);
    });
  });

  describe('[Login]', () => {
    it('should be login success', async () => {
      const userCreateParams: SignUpUserDto['userCreateParams'] = {
        ...typia.random<SignUpUserDto['userCreateParams']>(),
        password: 'mock-password',
      };
      const infoCreateParams: SignUpUserDto['infoCreateParams'] =
        typia.random<SignUpUserDto['infoCreateParams']>();
      const accountCreateParams: SignUpUserDto['accountCreateParams'] =
        typia.random<SignUpUserDto['accountCreateParams']>();
      const signupDto: SignUpUserDto = {
        userCreateParams,
        infoCreateParams,
        accountCreateParams,
        userTerms: [],
      };
      const loginDto: LoginUserDto = { ...userCreateParams };
      await UserHelper.createUser(signupDto, drizzle.db);

      const loginResponse = await AuthAPI.login(
        {
          host,
          headers: { LmsSecret },
        },
        loginDto,
      );
      if (!loginResponse.success) {
        const message = JSON.stringify(loginResponse.data, null, 4);
        throw new Error(`[assert] ${message}`);
      }

      const user = loginResponse.data;
      expect(user.email).toEqual(signupDto.userCreateParams.email);
    });
  });

  describe('[UpdateUserRole]', () => {
    it("should be update role 'user' -> 'teacher' success", async () => {
      const users = await seedUsers({ count: 1, role: 'admin' }, drizzle.db);
      const { user, userSession } = users[0];

      const response = await AuthAPI.admin.role.updateUserRole(
        {
          host,
          headers: { LmsSecret, UserSessionId: userSession.id },
        },
        {
          id: user.id,
          role: 'teacher',
        },
      );
      if (!response.success) {
        const message = JSON.stringify(response.data, null, 4);
        throw new Error(`[assert] ${message}`);
      }

      const updatedUser = response.data;
      expect(updatedUser.role).toEqual('teacher');
    });
  });

  describe('[Delete user account]', () => {
    it('should be delete user account success', async () => {
      const [{ user, userSession }] = await seedUsers(
        { count: 1, role: 'admin' },
        drizzle.db,
      );

      const response = await AuthAPI.account.deleteAccount({
        host,
        headers: { LmsSecret, UserSessionId: userSession.id },
      });
      if (!response.success) {
        const message = JSON.stringify(response.data, null, 4);
        throw new Error(`[assert] ${message}`);
      }

      const deletedUser = response.data;
      expect(deletedUser.id).toEqual(user.id);
    });

    it('should be restore deleted user account success', async () => {
      const [{ user, userSession }] = await seedUsers(
        { count: 1, role: 'admin' },
        drizzle.db,
      );
      const deletedResponse = await AuthAPI.account.deleteAccount({
        host,
        headers: { LmsSecret, UserSessionId: userSession.id },
      });
      if (!deletedResponse.success) {
        const message = JSON.stringify(deletedResponse.data, null, 4);
        throw new Error(`[assert] ${message}`);
      }

      const deletedUser = deletedResponse.data;
      expect(deletedUser.id).toEqual(user.id);

      const restoreResponse = await AuthAPI.account.restoreAccount({
        host,
        headers: { LmsSecret, UserSessionId: userSession.id },
      });
      if (!restoreResponse.success) {
        const message = JSON.stringify(restoreResponse.data, null, 4);
        throw new Error(`[assert] ${message}`);
      }

      const restoredUser = restoreResponse.data;
      expect(restoredUser.id).toEqual(user.id);
    });
  });
});
