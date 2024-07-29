import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './infra/db/db.module';
import { ConfigsModule } from './configs/configs.module';
import { UserModule } from './v1/user/user.module';
import { AuthModule } from './v1/auth/auth.module';
import { CategoryModule } from './v1/category/category.module';

@Module({
  imports: [
    ConfigsModule,
    DatabaseModule,
    UserModule,
    AuthModule,
    CategoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
