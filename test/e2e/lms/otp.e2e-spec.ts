import { INestApplication } from '@nestjs/common';
import { createTestingServer } from '../helpers/app.helper';
import { Uri } from '../../../src/shared/types/primitive';
import * as OtpAPI from '../../../src/api/functional/v1/otp';
import { DrizzleService } from '../../../src/infra/db/drizzle.service';
import { ConfigsService } from '../../../src/configs/configs.service';

describe('OtpController (e2e)', () => {
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

  describe('SMS OTP', () => {
    it('should be signup otp sequence success', async () => {
      const sendOtpResponse = await OtpAPI.signup.sendSignupOtp(
        {
          host,
          headers: { LmsSecret },
        },
        {
          phoneNumber: '01012345678',
        },
      );
      if (!sendOtpResponse.success) {
        const message = JSON.stringify(sendOtpResponse.data, null, 4);
        throw new Error(`[assert] ${message}`);
      }

      const otp = sendOtpResponse.data;
      expect(otp.code).toBeDefined();

      const verifyResponse = await OtpAPI.signup.verify.verifySignupOtp(
        {
          host,
          headers: { LmsSecret },
        },
        {
          code: otp.code,
        },
      );
      if (!verifyResponse.success) {
        const message = JSON.stringify(verifyResponse.data, null, 4);
        throw new Error(`[assert] ${message}`);
      }

      const { isValid } = verifyResponse.data;
      expect(isValid).toEqual(true);
    });
  });
});
