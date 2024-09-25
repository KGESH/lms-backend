import { SolapiMessageService } from 'solapi';
import { ConfigsService } from '@src/configs/configs.service';
import { SMS } from '@src/infra/sms/sms-vender.token';

export const SmsProvider = {
  provide: SMS,
  inject: [ConfigsService],
  useFactory: async ({ env }: Pick<ConfigsService, 'env'>) => {
    return new SolapiMessageService(env.SMS_API_KEY, env.SMS_API_SECRET);
  },
};
