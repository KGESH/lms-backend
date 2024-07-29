import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigsService } from './configs/configs.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const { env } = app.get(ConfigsService);
  await app.listen(env.APP_PORT, () => {
    console.log(`Server is running on port ${env.APP_PORT}`);
  });
}

bootstrap();
