import { Module } from '@nestjs/common';
import { DrizzleService } from './drizzle.service';
import { ConnectionPoolProvider } from './connection-pool.provider';

const providers = [ConnectionPoolProvider, DrizzleService];

@Module({
  providers: [...providers],
  exports: [...providers],
})
export class DrizzleModule {}
