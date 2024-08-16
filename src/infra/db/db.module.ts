import { Global, Module } from '@nestjs/common';
import { DrizzleModule } from './drizzle.module';

const modules = [DrizzleModule];

@Global()
@Module({
  imports: [...modules],
  exports: [...modules],
})
export class DatabaseModule {}
