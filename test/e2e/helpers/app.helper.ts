import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../src/app.module';
import { RANDOM_PORT } from '../../../src/shared/helpers/mocks/host.mock';
import { INestApplication } from '@nestjs/common';
import { HttpExceptionFilter } from '../../../src/core/http-exception.filter';

export const createTestingServer = async (): Promise<INestApplication> => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app: INestApplication = moduleFixture.createNestApplication();
  app.useGlobalFilters(new HttpExceptionFilter());
  await (await app.init()).listen(RANDOM_PORT);

  return app;
};
