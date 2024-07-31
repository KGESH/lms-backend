import { Module } from '@nestjs/common';
import { Pool } from 'pg';
import { DrizzleService } from './drizzle.service';
import {
  ConfigurableDatabaseModule,
  CONNECTION_POOL,
  DATABASE_OPTIONS,
} from './db.module-def';
import { IDatabaseConfigs } from '../../configs/configs.types';

@Module({
  providers: [
    DrizzleService,
    {
      provide: CONNECTION_POOL,
      inject: [DATABASE_OPTIONS],
      useFactory: async (env: IDatabaseConfigs) => {
        return new Pool({
          connectionString: env.DATABASE_URL,
        });
      },
    },
  ],
  exports: [DrizzleService],
})
export class DrizzleModule extends ConfigurableDatabaseModule {}
