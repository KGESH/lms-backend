import { INestiaConfig } from '@nestia/sdk';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';
import 'dotenv/config';

const env = new ConfigService();

const NESTIA_CONFIG: INestiaConfig = {
  // input: 'src/**/*.controller.ts',
  input: async () => {
    const app = await NestFactory.create(AppModule);
    // app.setGlobalPrefix("api");
    // app.enableVersioning({
    //     type: VersioningType.URI,
    //     prefix: "v",
    // })
    return app;
  },
  output: 'src/api',
  // clone: true,
  assert: true,
  simulate: true,
  propagate: true,
  e2e: 'test/e2e',
  distribute: 'packages/api',
  swagger: {
    openapi: '3.1',
    output: path.join(process.env.PWD as string, `swagger.json`),
    security: {
      bearer: {
        type: 'apiKey',
        name: 'Authorization',
        in: 'header',
      },
    },
    servers: [
      {
        url: `http://localhost:${env.get('APP_PORT')}`,
        description: 'Local Server',
      },
      {
        url: `http://h4gwg4kkw4kww80o8cc8k0s8.118.36.207.199.sslip.io`,
        description: 'Dev Server',
      },
    ],
    beautify: true,
  },
};
export default NESTIA_CONFIG;
