import { INestApplication } from '@nestjs/common';
import * as AuthAPI from '../../../src/api/functional/v1/auth';
import * as typia from 'typia';
import { createTestingServer } from '../helpers/app.helper';
import { SignupUserDto, LoginUserDto } from '../../../src/v1/auth/auth.dto';
import { Uri } from '../../../src/shared/types/primitive';
import { DrizzleService } from '../../../src/infra/db/drizzle.service';
import { KakaoLoginDto } from '../../../src/v1/auth/kakao-auth.dto';
import * as UserHelper from '../helpers/db/lms/user.helper';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let host: Uri;
  let drizzle: DrizzleService;

  beforeAll(async () => {
    app = await createTestingServer();
    host = await app.getUrl();
    drizzle = await app.get(DrizzleService);
  });

  afterAll(async () => {
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
        throw new Error('assert');
      }

      const user = response.data;
      expect(user.email).toEqual('sample@gmail.com');
    });
  });

  describe('[Signup]', () => {
    it('should be signup success', async () => {
      const userCreateParams: SignupUserDto['userCreateParams'] = {
        ...typia.random<SignupUserDto['userCreateParams']>(),
        password: 'mock-password',
      };
      const infoCreateParams: SignupUserDto['infoCreateParams'] =
        typia.random<SignupUserDto['infoCreateParams']>();
      const signupDto: SignupUserDto = {
        userCreateParams,
        infoCreateParams,
      };

      const response = await AuthAPI.signup({ host }, signupDto);
      if (!response.success) {
        throw new Error('assert');
      }

      const user = response.data;
      expect(user.email).toEqual(signupDto.userCreateParams.email);
    });
  });

  describe('[Login]', () => {
    it('should be login success', async () => {
      const userCreateParams: SignupUserDto['userCreateParams'] = {
        ...typia.random<SignupUserDto['userCreateParams']>(),
        password: 'mock-password',
      };
      const infoCreateParams: SignupUserDto['infoCreateParams'] =
        typia.random<SignupUserDto['infoCreateParams']>();
      const signupDto: SignupUserDto = {
        userCreateParams,
        infoCreateParams,
      };
      const loginDto: LoginUserDto = { ...userCreateParams };
      await UserHelper.createUser(signupDto, drizzle);

      const loginResponse = await AuthAPI.login({ host }, loginDto);
      if (!loginResponse.success) {
        throw new Error('assert');
      }

      const user = loginResponse.data;
      expect(user.email).toEqual(signupDto.userCreateParams.email);
    });
  });
});
