import { INestApplication } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import * as fs from 'fs';
import * as path from 'path';
import { IS_PRODUCTION } from '@src/shared/utils/is-production';

export const buildSwagger = (app: INestApplication) => {
  if (IS_PRODUCTION) {
    return;
  }

  const swaggerConfig = fs.readFileSync(
    path.join(process.env.PWD as string, 'swagger.json'),
    'utf-8',
  );

  SwaggerModule.setup('api-spec', app, JSON.parse(swaggerConfig));
};
