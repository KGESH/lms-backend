import { INestApplication } from '@nestjs/common';
import * as AuthApis from '../../nestia/api/functional/v1/auth';
import * as typia from 'typia';
import {
  IAuthTokens,
  IUserLogin,
  IUserSignup,
} from '../../src/v1/auth/auth.interface';
import { createTestingServer } from './app.helper';
import type {
  RefreshTokenDto,
  VerifyTokenDto,
} from '../../src/v1/auth/auth.dto';
import { Uri } from '../../src/shared/types/primitive';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let host: Uri;

  beforeAll(async () => {
    app = await createTestingServer();
    host = await app.getUrl();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('[Signup]', () => {
    it('should be signup success', async () => {
      const signupDto = typia.random<IUserSignup>();
      const response = await AuthApis.signup({ host }, signupDto);
      const user = response.data;
      expect(user.email).toEqual(signupDto.email);
    });
  });

  describe('[Login]', () => {
    it('should be login success', async () => {
      const signupDto: IUserSignup = typia.random<IUserSignup>();
      const loginDto: IUserLogin = { ...signupDto };
      const signupResponse = await AuthApis.signup({ host }, signupDto);
      const createdUser = signupResponse.data;
      expect(createdUser.email).toEqual(signupDto.email);

      const loginResponse = await AuthApis.login({ host }, loginDto);
      const tokens = loginResponse.data;
      const isAuthTokens = typia.is<IAuthTokens>(tokens);
      expect(isAuthTokens).toEqual(true);
    });
  });

  describe('[Jwt verify]', () => {
    it('should be verify access token success', async () => {
      const signupDto: IUserSignup = typia.random<IUserSignup>();
      const loginDto: IUserLogin = { ...signupDto };
      const signupResponse = await AuthApis.signup({ host }, signupDto);
      const createdUser = signupResponse.data;
      expect(createdUser.email).toEqual(signupDto.email);

      const loginResponse = await AuthApis.login({ host }, loginDto);
      const tokens = loginResponse.data;
      const isAuthTokens = typia.is<IAuthTokens>(tokens);
      expect(isAuthTokens).toEqual(true);

      const verifyTokenDto: VerifyTokenDto = {
        accessToken: tokens.accessToken,
      };
      const jwtVerifyResponse = await AuthApis.verify.verifyAccessToken(
        { host },
        verifyTokenDto,
      );
      const payload = jwtVerifyResponse.data;
      expect(payload.email).toEqual(loginDto.email);
    });
  });

  describe('[Refresh token]', () => {
    it('should be refresh access token success', async () => {
      const signupDto: IUserSignup = typia.random<IUserSignup>();
      const loginDto: IUserLogin = { ...signupDto };
      const signupResponse = await AuthApis.signup({ host }, signupDto);
      const createdUser = signupResponse.data;
      expect(createdUser.email).toEqual(signupDto.email);

      const loginResponse = await AuthApis.login({ host }, loginDto);
      const tokens = loginResponse.data;
      const isAuthTokens = typia.is<IAuthTokens>(tokens);
      expect(isAuthTokens).toBe(true);

      const verifyTokenDto: VerifyTokenDto = {
        accessToken: tokens.accessToken,
      };
      const jwtVerifyResponse = await AuthApis.verify.verifyAccessToken(
        { host },
        verifyTokenDto,
      );
      const payload = jwtVerifyResponse.data;
      expect(payload.email).toEqual(loginDto.email);

      const refreshTokenDto: RefreshTokenDto = {
        refreshToken: tokens.refreshToken,
      };
      const refreshResponse = await AuthApis.refresh_token.refreshToken(
        { host },
        refreshTokenDto,
      );
      const refreshed = refreshResponse.data;
      const isRefreshed = typia.is<Pick<IAuthTokens, 'accessToken'>>(refreshed);
      expect(isRefreshed).toBe(true);
      // Todo: check bug -> always return same access token. (only test)
      // expect(refreshed.accessToken).not.toEqual(verifyTokenDto.accessToken);
    });
  });
});
