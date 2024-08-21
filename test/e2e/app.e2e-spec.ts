import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { createTestingServer } from './helpers/app.helper';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestingServer();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/ (GET)', async () => {
    return request(app.getHttpServer()).get('/').expect(200).expect('pong');
  });
});
