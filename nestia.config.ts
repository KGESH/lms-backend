import { INestiaConfig } from '@nestia/sdk';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { NESTIA_MOCK_HOST } from './src/shared/helpers/mocks/host.mock';

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
  clone: true,
  assert: true,
  simulate: true,
  e2e: 'test/e2e',
  distribute: 'packages/api',
  swagger: {
    openapi: '3.1',
    output: 'dist/swagger.json',
    security: {
      bearer: {
        type: 'apiKey',
        name: 'Authorization',
        in: 'header',
      },
    },
    servers: [
      {
        url: NESTIA_MOCK_HOST,
        description: 'Local Server',
      },
    ],
    beautify: true,
  },
};
export default NESTIA_CONFIG;
