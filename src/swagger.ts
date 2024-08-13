import { INestApplication } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import * as fs from 'fs';
import * as path from 'path';

export const buildSwagger = (app: INestApplication) => {
  const swaggerConfig = fs.readFileSync(
    path.join(__dirname, 'swagger.json'),
    'utf-8',
  );

  SwaggerModule.setup('api-spec', app, JSON.parse(swaggerConfig));
};
