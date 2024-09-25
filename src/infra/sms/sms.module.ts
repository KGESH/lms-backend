import { Module } from '@nestjs/common';
import { SmsService } from '@src/infra/sms/sms.service';
import { SmsProvider } from '@src/infra/sms/sms.provider';

const modules = [];

const providers = [SmsProvider, SmsService];

@Module({
  imports: [...modules],
  providers: [...providers],
  exports: [...modules, ...providers],
})
export class SmsModule {}
