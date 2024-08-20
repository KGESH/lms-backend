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

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let host: Uri;
  let drizzle: DrizzleService;

  beforeEach(async () => {
    app = await createTestingServer();
    host = await app.getUrl();
    drizzle = await app.get(DrizzleService);
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

      const response = await AuthAPI.kakao.login.kakaoLogin({ host }, loginDto);
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
      };

      const response = await AuthAPI.signup({ host }, signupDto);
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
      };
      const loginDto: LoginUserDto = { ...userCreateParams };
      await UserHelper.createUser(signupDto, drizzle.db);

      const loginResponse = await AuthAPI.login({ host }, loginDto);
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
      const users = await seedUsers({ count: 1 }, drizzle.db);
      const { user } = users[0];

      const response = await AuthAPI.role.updateUserRole(
        { host },
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
});
