import { Module } from '@nestjs/common';
import { OtpController } from '@src/v1/auth/otp/otp.controller';
import { SmsModule } from '@src/infra/sms/sms.module';
import { OtpService } from '@src/v1/auth/otp/otp.service';
import { OtpRepository } from '@src/v1/auth/otp/otp.repository';
import { OtpQueryRepository } from '@src/v1/auth/otp/otp-query.repository';
import { UserModule } from '@src/v1/user/user.module';

const modules = [UserModule, SmsModule];

const providers = [OtpService, OtpRepository, OtpQueryRepository];

@Module({
  imports: [...modules],
  controllers: [OtpController],
  providers: [...providers],
  exports: [...modules, ...providers],
})
export class OtpModule {}
