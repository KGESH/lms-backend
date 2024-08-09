import { Global, Module } from '@nestjs/common';
import { DrizzleModule } from './drizzle.module';
import { ConfigsService } from '../../configs/configs.service';
import { createTestDbContainer } from '../../../test/e2e/helpers/db/db.helper';
import { NODE_ENV_TEST } from '../../configs/configs.constant';

@Global()
@Module({
  imports: [
    DrizzleModule.forRootAsync({
      inject: [ConfigsService],
      useFactory: async ({ env }: ConfigsService) => {
        return {
          DATABASE_URL:
            env.NODE_ENV === NODE_ENV_TEST
              ? await createTestDbContainer()
              : env.DATABASE_URL,
        };
      },
    }),
  ],
  exports: [DrizzleModule],
})
export class DatabaseModule {}
