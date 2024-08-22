import { NestFactory } from '@nestjs/core';
import { AppModule } from '@src/app.module';
import { ConfigsService } from '@src/configs/configs.service';
import { HttpExceptionFilter } from '@src/core/http-exception.filter';
import { buildSwagger } from '@src/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const { env } = app.get(ConfigsService);

  app.enableCors();
  app.useGlobalFilters(new HttpExceptionFilter());
  buildSwagger(app);

  await app.listen(env.APP_PORT, () => {
    console.log(`Server is running on port ${env.APP_PORT}`);
  });
}

bootstrap();
