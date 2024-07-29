import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ConfigsService } from './configs.service';
import {
  DOT_ENV_DEVELOPMENT,
  DOT_ENV_TEST,
  NODE_ENV,
  NODE_ENV_TEST,
} from './configs.constant';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath:
        NODE_ENV === NODE_ENV_TEST ? DOT_ENV_TEST : DOT_ENV_DEVELOPMENT,
    }),
  ],
  providers: [ConfigsService],
  exports: [ConfigsService],
})
export class ConfigsModule {}
