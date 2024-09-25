import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@src/app.module';
import { RANDOM_PORT } from '@src/shared/helpers/mocks/host.mock';
import { INestApplication } from '@nestjs/common';
import { HttpExceptionFilter } from '@src/core/http-exception.filter';
import { SmsService } from '@src/infra/sms/sms.service';

export const createTestingServer = async (): Promise<INestApplication> => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideProvider(SmsService)
    .useValue({
      sendSms: async (
        params: Parameters<SmsService['sendSms']>[0],
      ): ReturnType<SmsService['sendSms']> => {},
    })
    .compile();

  const app: INestApplication = moduleFixture.createNestApplication();
  app.useGlobalFilters(new HttpExceptionFilter());
  await (await app.init()).listen(RANDOM_PORT);

  return app;
};
