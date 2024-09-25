import { Inject, Injectable, Logger } from '@nestjs/common';
import { SMS } from '@src/infra/sms/sms-vender.token';
import { SolapiMessageService } from 'solapi';
import { ConfigsService } from '@src/configs/configs.service';

/**
 * @docs
 * https://github.com/solapi/solapi-nodejs/blob/master/examples/javascript/common/src/sms/send_sms.js
 */
@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);
  constructor(
    private readonly configsService: ConfigsService,
    @Inject(SMS) private readonly solapiMessageService: SolapiMessageService,
  ) {}

  async sendSms({
    targetPhoneNumber,
    content,
  }: {
    targetPhoneNumber: string;
    content: string;
  }) {
    const response = await this.solapiMessageService.sendOne({
      to: targetPhoneNumber,
      text: content,
      from: this.configsService.env.FROM_PHONE_NUMBER,
    });

    this.logger.log(response);
  }
}
